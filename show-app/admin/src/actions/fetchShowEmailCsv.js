import { format } from 'date-fns';
import config from 'config';

import { FETCH_SHOW_EMAIL_CSV } from './const';

import showSnackbar from './showSnackbar';

function action(showId, showDate) {
  return [
    { type: FETCH_SHOW_EMAIL_CSV, showId, showDate },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/loginEmailCsv/${showId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
        let results = await response.json();
        let keys = Object.keys(results[0]);
        let csvContent = "data:text/csv;charset=utf-8,";
        results.forEach(item => {
          let row = Object.values(item);
          var finalVal = '';
          for (var j = 0; j < row.length; j++) {
              var innerValue = row[j] === null ? '' : row[j].toString();
              if (row[j] instanceof Date) {
                  innerValue = row[j].toLocaleString();
              };
              var result = innerValue.replace(/"/g, '""');
              if (result.search(/("|,|\n)/g) >= 0)
                  result = '"' + result + '"';
              if (j > 0)
                  finalVal += ',';
              finalVal += result;
          }
          finalVal += '\n';
          csvContent += finalVal;
        });
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `emails-${format(new Date(showDate), 'M-d-yy--h-mm-a')}.csv`);
        link.click();

        console.log(showDate, results);

        dispatch(showSnackbar('Login email CSV downloaded!'));
      } catch(e) {
        dispatch(showSnackbar(`Error getting login email CSV: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
