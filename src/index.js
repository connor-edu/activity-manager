/**
 * If the database is in local storage, we need correctly parse its contents.
 *
 * Date objects cannot be correctly stored in JSON format, so they are convert to a string first,
 * here we convert those strings back to Date objects.
 */
function getDatabaseFromLocalStorage() {
  const db = localStorage.getItem("db");
  if (!db) {
    return undefined;
  }

  const database = JSON.parse(db);
  database.forEach((list) => {
    list.createdAt = new Date(list.createdAt);
    list.items.forEach((item) => {
      item.createdAt = new Date(item.createdAt);
      if (item.completedAt) {
        item.completedAt = new Date(item.completedAt);
      }
    });
  });
  return database;
}

/**
 * Create a database of all created lists and their items.
 *
 * If the user has used the site before, then we will retrieve the data from the localstorage,
 * other we create an template one for them.
 */
const db = getDatabaseFromLocalStorage() || [
  {
    createdAt: new Date(),
    name: "List One",
    items: [
      {
        createdAt: new Date(),
        name: "Item One",
        completedAt: null,
      },
      {
        createdAt: new Date(),
        name: "Item Two",
        completedAt: null,
      },
    ],
  },
];

function save() {
  localStorage.setItem("db", JSON.stringify(db));
}

function renderItem(item) {
  /**
   * Create a container to hold all of the data about this item.
   */
  const itemContainer = document.createElement("li");
  itemContainer.className = "item";

  /**
   * Create a container to hold all of the details about this item, to be
   * display to lhe left of the actions.
   */
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "details-container";

  /**
   * Add the name and the completed/created at timestamp to the details container.
   */
  const name = document.createElement("h3");
  name.textContent = item.name;
  const time = document.createElement("span");
  function renderTime() {
    time.textContent = `${item.completedAt ? "Completed" : "Created"} at ${(
      item.completedAt || item.createdAt
    ).toLocaleString()}`;
  }

  renderTime();

  detailsContainer.appendChild(name);
  detailsContainer.appendChild(time);
  itemContainer.appendChild(detailsContainer);
  itemContainer.addEventListener("click", () => {
    if (item.completedAt) {
      item.completedAt = null;
    } else {
      item.completedAt = new Date();
    }

    itemContainer.className = "item" + (item.completedAt ? " completed" : "");
    renderTime();
  });
  return itemContainer;
}

function renderList(list) {
  /**
   * Create a container element to hold all of the data about our list.
   */
  const listContainer = document.createElement("li");
  listContainer.className = "list";
  /**
   * Create a heading element to display the list name,
   * and append to our container.
   */
  const header = document.createElement("h1");
  header.textContent = list.name;
  listContainer.appendChild(header);
  const itemsContainer = document.createElement("ul");
  list.items.map(renderItem).forEach((itemContainer) => {
    itemsContainer.appendChild(itemContainer);
  });
  const newItemContainer = document.createElement("li");
  newItemContainer.className = "item no-padding";
  const newItemButton = document.createElement("button");
  newItemButton.className = "btn btn-new-item";
  newItemButton.textContent = "New Item";
  newItemContainer.appendChild(newItemButton);
  itemsContainer.appendChild(newItemContainer);
  listContainer.appendChild(itemsContainer);
  newItemButton.addEventListener("click", () => {
    // eslint-disable-next-line no-alert
    const name = prompt("Item Name");
    if (!name) {
      return;
    }

    const item = {
      name,
      createdAt: new Date(),
      completedAt: null,
    };
    list.items.push(item);
    itemsContainer.insertBefore(renderItem(item), newItemContainer);
    save();
  });
  return listContainer;
}

function render() {
  /**
   * Get the root element.
   */
  const root = document.getElementById("root");
  /**
   * Create a list element that will hold all of our lists.
   */
  const rootContainer = document.createElement("ul");
  rootContainer.className = "section";
  /**
   * For each list in our database, render it out to an element, and add
   * it to our container.
   */
  db.map(renderList).forEach((listContainer) => {
    rootContainer.appendChild(listContainer);
  });
  /**
   * Reset the root element, and add out new element to it.
   */
  root.innerHTML = "";
  root.appendChild(rootContainer);
  const newListContainer = document.createElement("div");
  newListContainer.className = "section";
  const newListButton = document.createElement("button");
  newListButton.classList = "btn btn-new-list";
  newListButton.textContent = "New List";
  newListContainer.appendChild(newListButton);
  root.appendChild(newListContainer);
  newListButton.addEventListener("click", () => {
    // eslint-disable-next-line no-alert
    const name = prompt("List Name");
    if (!name) {
      return;
    }

    const list = {
      name,
      createdAt: new Date(),
      items: [],
    };
    db.push(list);
    rootContainer.appendChild(renderList(list));
    save();
  });
}

render();
