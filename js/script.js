let inputShop = null;
let inputMoney = null;

let valueShop = "";
let valueMoney = "";

let arrayShoping = [];

window.onload = async () => {
  inputShop = document.getElementById("name-shop");
  inputMoney = document.getElementById("add-money");

  inputShop.addEventListener("change", updateShop);
  inputMoney.addEventListener("change", updateMoney);

  const connect = await fetch("http://localhost:8000/allShops", {
    method: "GET",
  });

  const result = await connect.json();
  arrayShoping = result.data;

  dateChanged();

  renderShop();
};

const updateShop = (event) => {
  valueShop = event.target.value;
};

const updateMoney = (event) => {
  valueMoney = event.target.value;
};

const addShopButton = async () => {
  if (
    valueShop.trim() &&
    valueMoney &&
    valueMoney > 0 &&
    valueMoney <= 9999999
  ) {
    const connect = await fetch("http://localhost:8000/createShop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        shop: valueShop,
        money: valueMoney,
      }),
    });

    const result = await connect.json();
    arrayShoping = result.data;

    inputShop.value = "";
    inputMoney.value = "";
    valueShop = "";
    valueMoney = "";

    dateChanged();

    renderShop();
  } else {
    alert(
      "Error, incorrect data!!! The fields are empty or the number exceeds 9999999!!!!"
    );
  }
};

const renderShop = () => {
  const listGroup = document.getElementById("shop-list");

  while (listGroup.firstChild) {
    listGroup.removeChild(listGroup.firstChild);
  }

  arrayShoping.map((item, index) => {
    const { shop, date, money } = item;

    const objItem = createItem(index, shop, date, money);

    const listGroupItem = document.createElement("div");
    listGroupItem.className = "list-group-item";
    listGroupItem.id = `item-${index}`;

    const { name, dateObj } = objItem;

    listGroupItem.appendChild(name);
    listGroupItem.appendChild(dateObj);
    listGroup.appendChild(listGroupItem);
  });

  updateResult();
};

const delItem = async (index) => {
  const id = arrayShoping[index]._id;
  arrayShoping.splice(index, 1);
  const connect = await fetch(`http://localhost:8000/delShop?_id=${id}`, {
    method: "DELETE",
  });
  renderShop();
};

const editItem = (index) => {
  const listGroupItem = document.getElementById(`item-${index}`);
  listGroupItem.className = "edit-item";

  while (listGroupItem.firstChild) {
    listGroupItem.removeChild(listGroupItem.firstChild);
  }
  const { shop, date, money } = arrayShoping[index];

  const nameShop = document.createElement("input");
  const textDate = document.createElement("input");
  const textMoney = document.createElement("input");
  const listGroupItemImg = document.createElement("div");
  const okImg = document.createElement("img");
  const delImg = document.createElement("img");

  nameShop.type = "text";
  nameShop.id = `text-${index}`;
  nameShop.value = shop;
  nameShop.maxLength = 16;

  textDate.type = "date";
  textDate.id = `date-${index}`;
  textDate.min = "2018-01-01";
  textDate.max = "2022-12-31";
  textDate.value = date;

  textMoney.type = "number";
  textMoney.id = `money-${index}`;
  textMoney.value = money;
  textMoney.min = 0;
  textMoney.max = 9999999;

  listGroupItemImg.className = "list-group-item-img";
  okImg.src = "https://img.icons8.com/ios/50/000000/ok--v1.png";
  delImg.src = "https://img.icons8.com/ios/100/000000/cancel.png";

  okImg.onclick = () => changeItem(index);
  delImg.onclick = () => closeChange(index, shop, date, money);

  listGroupItemImg.appendChild(okImg);
  listGroupItemImg.appendChild(delImg);
  listGroupItem.appendChild(nameShop);
  listGroupItem.appendChild(textDate);
  listGroupItem.appendChild(textMoney);
  listGroupItem.appendChild(listGroupItemImg);
};

const updateResult = () => {
  const resultMoney = document.getElementById("result-money");
  let sum = 0;

  arrayShoping.map((item) => {
    sum = sum + Number(item.money);
  });

  resultMoney.innerText = `Итог: ${sum} р.`;
};

const createItem = (index, shop, date, money) => {
  const nameShop = document.createElement("p");
  const listGroupItemDateImg = document.createElement("div");
  const listGroupItemDateMoney = document.createElement("div");
  const textDate = document.createElement("p");
  const textMoney = document.createElement("p");
  const listGroupItemImg = document.createElement("div");
  const editImg = document.createElement("img");
  const delImg = document.createElement("img");

  nameShop.id = `PS-${index}`;
  textDate.id = `PD-${index}`;
  textMoney.id = `PM-${index}`;

  nameShop.ondblclick = () => {
    changeValue(index, "shop", "text");
  };
  textDate.ondblclick = () => {
    changeValue(index, "date", "date");
  };
  textMoney.ondblclick = () => {
    changeValue(index, "money", "number");
  };

  let newDate = "";
  const subDate = date.split("-");
  newDate = subDate[2] + "." + subDate[1] + "." + subDate[0];

  nameShop.innerText = `${index + 1}) Магазин \"${shop}\"`;
  listGroupItemDateImg.className = "list-group-item-date-img";
  listGroupItemDateMoney.className = "list-group-item-date-money";
  listGroupItemDateMoney.id = `date-money-${index}`;
  textDate.innerText = newDate;
  textMoney.innerText = `${money} р.`;
  listGroupItemImg.className = "list-group-item-img";
  editImg.src = "https://img.icons8.com/ios/100/000000/edit--v1.png";
  delImg.src = "https://img.icons8.com/ios/100/000000/waste.png";

  editImg.onclick = () => editItem(index);
  delImg.onclick = () => delItem(index);

  listGroupItemImg.appendChild(editImg);
  listGroupItemImg.appendChild(delImg);
  listGroupItemDateMoney.appendChild(textDate);
  listGroupItemDateMoney.appendChild(textMoney);
  listGroupItemDateImg.appendChild(listGroupItemDateMoney);
  listGroupItemDateImg.appendChild(listGroupItemImg);

  const obj = {
    name: nameShop,
    dateObj: listGroupItemDateImg,
  };

  return obj;
};

const closeChange = (index, shop, date, money) => {
  const listGroupItem = document.getElementById(`item-${index}`);
  listGroupItem.className = "list-group-item";

  while (listGroupItem.firstChild) {
    listGroupItem.removeChild(listGroupItem.firstChild);
  }

  const objItem = createItem(index, shop, date, money);

  const { name, dateObj } = objItem;

  listGroupItem.appendChild(name);
  listGroupItem.appendChild(dateObj);
};

const changeItem = (index) => {
  const inputName = document.getElementById(`text-${index}`);
  const inputDate = document.getElementById(`date-${index}`);
  const inputNewMoney = document.getElementById(`money-${index}`);

  if (
    inputName.value.trim() &&
    inputDate.value &&
    inputDate.value.length === 10 &&
    +inputNewMoney.value &&
    inputNewMoney.value &&
    inputNewMoney.value > 0 &&
    inputDate.max >= inputDate.value &&
    inputDate.min <= inputDate.value &&
    inputNewMoney.value <= 9999999
  ) {
    arrayShoping[index].shop = inputName.value;
    arrayShoping[index].date = inputDate.value;
    arrayShoping[index].money = inputNewMoney.value;

    updateResult();
    changeBD(index);
    const { shop, date, money } = arrayShoping[index];
    closeChange(index, shop, date, money);
  } else {
    const { shop, date, money } = arrayShoping[index];
    closeChange(index, shop, date, money);
    alert(`Error, incorrect data!!!\nThe store name field should not be empty!
Date from 01.01.2018 to 31.12.2022!\nThe amount of money from 1 to 9999999!
I don't believe you're spending so much!!!`);
  }
};

const dateChanged = () => {
  arrayShoping.map((item) => {
    item.date = item.date.slice(0, 10);
  });
};

const changeBD = async (index) => {
  const { _id, shop, date, money } = arrayShoping[index];
  const connect = await fetch("http://localhost:8000/updateShop", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id,
      shop,
      date,
      money,
    }),
  });
};

const changeValue = (index, key, typeInput) => {
  if (key === "shop") {
    const shopName = document.getElementById(`PS-${index}`);
    shopName.className = "hid";
    const listGroupItem = document.getElementById(`item-${index}`);
    const newInput = document.createElement("input");

    newInput.type = typeInput;
    newInput.autofocus = true;
    newInput.id = `${typeInput}-${index}`;
    newInput.value = arrayShoping[index][key];
    newInput.maxLength = 16;
    newInput.onblur = () => {
      updateOneValue(index, key, typeInput);
    };

    listGroupItem.prepend(newInput);
  } else if (key === "date") {
    const listGroupItem = document.getElementById(`date-money-${index}`);
    const newInput = document.createElement("input");

    const dateName = document.getElementById(`PD-${index}`);
    dateName.className = "hid";

    newInput.type = typeInput;
    newInput.autofocus = true;
    newInput.id = `${typeInput}-${index}`;
    newInput.value = arrayShoping[index][key];
    newInput.min = "2018-01-01";
    newInput.max = "2022-12-31";

    newInput.onblur = () => {
      updateOneValue(index, key, typeInput);
    };

    listGroupItem.prepend(newInput);
  } else if (key === "money") {
    const listGroupItem = document.getElementById(`date-money-${index}`);
    const newInput = document.createElement("input");

    const moneyName = document.getElementById(`PM-${index}`);
    moneyName.className = "hid";

    newInput.type = typeInput;
    newInput.autofocus = true;
    newInput.id = `${typeInput}-${index}`;
    newInput.value = arrayShoping[index][key];
    newInput.min = 1;
    newInput.max = 9999999;

    newInput.onblur = () => {
      updateOneValue(index, key, typeInput);
    };

    listGroupItem.append(newInput);
  }
};

const updateOneValue = (index, key, typeInput) => {
  const inputNew = document.getElementById(`${typeInput}-${index}`);
  const value = inputNew.value;
  if (key === "shop") {
    if (value.trim() && value.trim().length <= 16) {
      arrayShoping[index][key] = value.trim();
      changeBD(index);
      location.reload();
    } else {
      alert("Invalid name!!!\nThe store name field should not be empty!");
      location.reload();
    }
  } else if (key === "date") {
    if (
      value.trim() &&
      value.length === 10 &&
      inputNew.max >= value &&
      inputNew.min <= value
    ) {
      arrayShoping[index][key] = value.trim();
      changeBD(index);
      location.reload();
    } else {
      alert("Invalid date!!!\nDate from 01.01.2018 to 31.12.2022!\n");
      location.reload();
    }
  } else if (key === "money") {
    if (+value && value && value > 0 && value <= 9999999) {
      arrayShoping[index][key] = value.trim();
      changeBD(index);
      location.reload();
    } else {
      alert(
        "Invalid money!!!\nThe amount of money from 1 to 9999999!\nI don't believe you're spending so much!!!"
      );
      location.reload();
    }
  } else {
    alert("Error!!! incorrect key");
    renderShop();
  }
};
