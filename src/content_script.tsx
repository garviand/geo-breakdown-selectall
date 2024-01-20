const startScoresSelect = () => {
  selectAllPlayers();
  let breakdownTable = document.querySelector("[class^=results_table__]");
  if (breakdownTable) {
    initScoreObserver(breakdownTable as HTMLElement);
  }
  const maxLoadMore = 3;
  for (let index = 0; index < maxLoadMore; index++) {
    const canLoadMore = loadMoreScores();
    if (!canLoadMore) {
      break;
    }
  }
}

const loadMoreScores = () => {
  const loadMoreContainer = document.querySelector("[class^=results_center]")
  if (loadMoreContainer?.firstChild) {
    const loadMoreButton = loadMoreContainer.firstChild;
    loadMoreButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  }
  return false;
}

const selectAllPlayers = () => {
  const allScoreRows = document.querySelectorAll("[class^=results_row_]");
  allScoreRows.forEach((scoreRow) => {
    const className = scoreRow.className;
    if (!className.includes('results_headerRow') && !className.includes('results_selected')) {
      scoreRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  })
}

const cellStyle = `display: flex; cursor: default; justify-content: center; align-items: center;`;
const buttonStyle = `align-items: center; color: #FFF; background: none; border: 0.0625rem solid var(--ds-color-white); border-radius: 0.25rem; cursor: pointer; display: flex; height: 2rem; justify-content: center; padding: 1rem; transition: transform .1s ease; z-index: 4000; position: relative; top: -12px;`

const getButton = () => {
  const button = document.createElement("button");
  button.appendChild(
    document.createTextNode('Select All')
  )
  button.setAttribute('style', buttonStyle);
  button.addEventListener('click', startScoresSelect);
  button.id = 'select_all_button';
  return button;
}

const addButtonToFirstRow = (buttonCell: HTMLElement) => {
  if (buttonCell.className.includes('button_wrapper')) {
    return;
  }
  if (buttonCell) {
    buttonCell.setAttribute('style', cellStyle);
    const button = getButton();
    buttonCell.appendChild(button);
    tableObserver.disconnect();
  }
}

// watch for new scores and select them

const scoreObserver = new MutationObserver((mutations: Array<MutationRecord>) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const element = node as HTMLElement;
      if (
        !element.className.includes('results_headerRow') &&
        !element.className.includes('results_selected') &&
        !element.className.includes('Divider')
      ) {
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    })
  })
});

const initScoreObserver = (scoresContainer: HTMLElement) => {
  scoreObserver.observe(scoresContainer, {childList: true});
}

// watch for table render and add button

const tableObserver = new MutationObserver((mutations: Array<MutationRecord>) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const buttonCell = node.firstChild?.firstChild as HTMLElement;
      addButtonToFirstRow(buttonCell);
    })
  })
});

chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === 'on_results_page') {
    let breakdownTable = document.querySelector("[class^=results_table__]")
    if (breakdownTable) {
      const buttonCell = breakdownTable.firstChild?.firstChild as HTMLElement;
      addButtonToFirstRow(buttonCell);
    }
    else {
      breakdownTable = document.querySelector("[class^=results_container]")
      if (breakdownTable) {
        tableObserver.observe(breakdownTable, { childList: true });
      }
    }
  }
});
