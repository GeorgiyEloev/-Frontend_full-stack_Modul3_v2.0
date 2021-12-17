let inputShop = null;
let inputMoney = null;

let valueShop = "";
let valueMoney = "";

let arrayShoping = JSON.parse(localStorage.getItem("shop")) || [];

window.onload = () => {
  inputShop = document.getElementById("name-shop");
  inputMoney = document.getElementById("add-money");

  inputShop.addEventListener("change", updateShop);
  inputMoney.addEventListener("change", updateMoney);

	renderShop();	
};

const updateShop = (event) => {
  valueShop = event.target.value;
};

const updateMoney = (event) => {
  valueMoney = event.target.value;
};

const addShopButton = () => {
  const data = new Date();
  const strData =
    "" + data.getDate() + "." + data.getMonth() + "." + data.getFullYear();

  arrayShoping.push({
    shop: valueShop,
    date: strData,
    money: valueMoney,
  });

  localStorage.setItem("shop", JSON.stringify(arrayShoping));
  inputShop.value = "";
  inputMoney.value = "";
  valueShop = "";
  valueMoney = "";

  renderShop();
};

const renderShop = () => {
  const listGroup = document.getElementById("shop-list");

  while (listGroup.firstChild) {
    listGroup.removeChild(listGroup.firstChild);
  }

  arrayShoping.map((item, index) => {
		const {shop, date, money} = item;

		const listGroupItem = document.createElement("div");
		const nameShop = document.createElement("p");
		const listGroupItemDateImg = document.createElement("div");
		const 
	});
};
