export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('message', e => {
    if (!e) return;
    const { searchTerms, URLDetails, query } = e.data;

    const max = (a, b) => (a > b ? a : b);

    const fzyIsLower = s => s.toLowerCase() === s;

    const fzyIsUpper = s => s.toUpperCase() === s;

    const fzyPreComputeBonus = haystack => {
      const SCORE_MATCH_SLASH = 0.9;
      const SCORE_MATCH_WORD = 0.8;
      const SCORE_MATCH_CAPITAL = 0.7;
      const SCORE_MATCH_DOT = 0.6;

      const m = haystack.length;
      const matchBonus = new Array(m);

      let lastCh = '/';
      for (let i = 0; i < m; i++) {
        const ch = haystack[i];

        if (lastCh === '/') {
          matchBonus[i] = SCORE_MATCH_SLASH;
        } else if (lastCh === '-' || lastCh === '_' || lastCh === ' ') {
          matchBonus[i] = SCORE_MATCH_WORD;
        } else if (lastCh === '.') {
          matchBonus[i] = SCORE_MATCH_DOT;
        } else if (fzyIsLower(lastCh) && fzyIsUpper(ch)) {
          matchBonus[i] = SCORE_MATCH_CAPITAL;
        } else {
          matchBonus[i] = 0;
        }

        lastCh = ch;
      }

      return matchBonus;
    };

    const fzyCompute = (needle, haystack, D, M) => {
      const SCORE_MIN = -Infinity;
      const SCORE_GAP_LEADING = -0.005;
      const SCORE_GAP_TRAILING = -0.005;
      const SCORE_GAP_INNER = -0.01;
      const SCORE_MATCH_CONSECUTIVE = 1.0;

      const n = needle.length;
      const m = haystack.length;

      const lowerNeedle = needle.toLowerCase();
      const lowerHaystack = haystack.toLowerCase();
      const matchBonus = fzyPreComputeBonus(haystack);

      for (let i = 0; i < n; i++) {
        D[i] = new Array(m);
        M[i] = new Array(m);

        let prevScore = SCORE_MIN;
        const gapScore = i === n - 1 ? SCORE_GAP_TRAILING : SCORE_GAP_INNER;

        for (let j = 0; j < m; j++) {
          if (lowerNeedle[i] === lowerHaystack[j]) {
            let score = SCORE_MIN;
            if (!i) {
              score = j * SCORE_GAP_LEADING + matchBonus[j];
            } else if (j) {
              /* i > 0 && j > 0 */
              score = max(
                M[i - 1][j - 1] + matchBonus[j],
                D[i - 1][j - 1] + SCORE_MATCH_CONSECUTIVE
              );
            }
            const maxVal = max(score, prevScore + gapScore);
            D[i][j] = score;
            M[i][j] = maxVal;
            prevScore = maxVal;
          } else {
            D[i][j] = SCORE_MIN;
            M[i][j] = prevScore + gapScore;
            prevScore += gapScore;
          }
        }
      }
    };

    const fzyScore = (needle, haystack) => {
      const SCORE_MIN = -Infinity;
      const SCORE_MAX = Infinity;

      const n = needle.length;
      const m = haystack.length;

      if (!n || !m) return SCORE_MIN;

      if (n === m) {
        return SCORE_MAX;
      }

      if (m > 1024) {
        return SCORE_MIN;
      }

      const D = new Array(n);
      const M = new Array(n);

      fzyCompute(needle, haystack, D, M);

      return M[n - 1][m - 1];
    };

    const topNElements = (arr, n) => {
      if (arr.length <= n) {
        arr.sort((a, b) => fzyScore(query, b) - fzyScore(query, a));
        return arr;
      }
      const fzyScores = arr.map(x => fzyScore(query, x));
      const result = [];
      for (let i = 0; i < n; i++) {
        let largestScoreIdx = -1;
        for (let j = 0; j < fzyScores.length; j++) {
          if (fzyScores[j]) {
            if (largestScoreIdx === -1) {
              largestScoreIdx = j;
              // eslint-disable-next-line no-continue
              continue;
            }
            if (fzyScores[j] > fzyScores[largestScoreIdx]) {
              largestScoreIdx = j;
            }
          }
        }
        result.push(arr[largestScoreIdx]);
        fzyScores[largestScoreIdx] = null;
      }
      return result;
    };

    const getSearchResults = (keywords, urlDetails, queryStr) => {
      const { dirFormatted, branchName } = urlDetails;
      if (keywords && keywords[dirFormatted] && keywords[dirFormatted][branchName]) {
        const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
        const reHasRegExpChar = RegExp(reRegExpChar.source);

        // eslint-disable-next-line no-confusing-arrow
        const escapeRegExp = str =>
          reHasRegExpChar.test(str) ? str.replace(reRegExpChar, '\\$&') : str;
        const regex = new RegExp(queryStr.split('').map(escapeRegExp).join('.*'), 'i');
        const resultArray = keywords[dirFormatted][branchName].filter(ele => ele.match(regex));
        return topNElements(resultArray, 25);
      }
      return [];
    };

    // eslint-disable-next-line no-undef
    postMessage(getSearchResults(searchTerms, URLDetails, query));
  });
};
