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
  if (valueShop && valueMoney) {
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
    alert("Поле пустое!!!");
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

const delItem = (index) => {
  arrayShoping.splice(index, 1);
  localStorage.setItem("shop", JSON.stringify(arrayShoping));
  renderShop();
};

const editItem = (index) => {
  const listGroupItem = document.getElementById(`item-${index}`);
  listGroupItem.className = "edit-item";

  while (listGroupItem.firstChild) {
    listGroupItem.removeChild(listGroupItem.firstChild);
  }

  const { shop, date, money } = arrayShoping[index];
  let newDate = "";
  const subDate = date.split(".");
  newDate = subDate[2] + "-" + subDate[1] + "-" + subDate[0];

  const nameShop = document.createElement("input");
  const textDate = document.createElement("input");
  const textMoney = document.createElement("input");
  const listGroupItemImg = document.createElement("div");
  const okImg = document.createElement("img");
  const delImg = document.createElement("img");

  nameShop.type = "text";
  nameShop.id = `text-${index}`;
  nameShop.value = shop;
  textDate.type = "date";
  textDate.id = `date-${index}`;
  textDate.value = newDate;
  textMoney.type = "number";
  textMoney.id = `money-${index}`;
  textMoney.value = money;
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

  nameShop.innerText = `${index + 1}) Магазин \"${shop}\"`;
  listGroupItemDateImg.className = "list-group-item-date-img";
  listGroupItemDateMoney.className = "list-group-item-date-money";
  textDate.innerText = date;
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

  let newDate = "";
  const subDate = inputDate.value.split("-");
  newDate = subDate[2] + "." + subDate[1] + "." + subDate[0];

  arrayShoping[index].shop = inputName.value;
  arrayShoping[index].date = newDate;
  arrayShoping[index].money = inputNewMoney.value;

  localStorage.setItem("shop", JSON.stringify(arrayShoping));

  updateResult();

  const { shop, date, money } = arrayShoping[index];
  closeChange(index, shop, date, money);
};

const dateChanged = () => {
  arrayShoping.map((item) => {
    item.date = item.date.slice(0, 10);
  });
};
