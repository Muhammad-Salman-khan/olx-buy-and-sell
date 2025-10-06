let UsernameInputEl = document.getElementById("usernameInput");
let EmailInputEl = document.getElementById("emailInput");
let PasswordInputEl = document.getElementById("passwordInput");
let messageEl = document.getElementById("message");
let auth = firebase.auth();
const db = firebase.firestore();
let userid = localStorage.getItem("userid");
const SignUp = () => {
  if (UsernameInputEl.value && EmailInputEl.value && PasswordInputEl.value) {
    auth
      .createUserWithEmailAndPassword(EmailInputEl.value, PasswordInputEl.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        messageEl.className = "text-green-500 text-center";
        messageEl.innerText = `User signUp successfully with userid ${user.uid}`;
        console.log(user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        messageEl.innerText = errorMessage;
        messageEl.className = "text-red-400  text-center";
        console.log(errorCode, errorMessage);
      });
  }
};
const Login = () => {
  if (UsernameInputEl.value && EmailInputEl.value && PasswordInputEl.value) {
    auth
      .signInWithEmailAndPassword(EmailInputEl.value, PasswordInputEl.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        messageEl.className = "text-green-500 text-center";
        messageEl.innerText = `User loggedIn successfully with userid ${user.uid}`;
        localStorage.setItem("userid", user.uid);
        localStorage.setItem("username", UsernameInputEl.value);
        username = localStorage.getItem("username");
        console.log(username);
        console.log(userid);
        setTimeout(() => {
          messageEl.innerHTML = "Wait for redirect";
        }, 2000);
        ReDirectToPage("./olx.html");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        messageEl.innerText = errorMessage;
        messageEl.className = "text-red-400  text-center";
        console.log(errorCode, errorMessage);
      });
  }
};
const LogOut = () => {
  const confirm = window.confirm("Are you sure you want to Logout");
  if (confirm) {
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("username");
        ReDirectToPage("../index.html");
      })
      .catch((error) => {
        alert("something went wrong", error);
      });
  }
};

const ReDirectToPage = (e) => {
  setTimeout(() => {
    window.location.href = e;
  }, 4000);
};

let greetingsUserMessageEl = document.getElementById("Greetings-user");
const greetings = () => {
  greetingsUserMessageEl.innerHTML = localStorage.getItem("username");
};

const DivCards = document.getElementById("add-cards");

let titleEl = document.getElementById("titleEl");
let priceEl = document.getElementById("priceEl");
let descriptionEl = document.getElementById("descriptionEl");
let itemImageEl = document.getElementById("itemImageEl");
const AddItems = () => {
  ReDirectToPage("../addItem.html");
};

const AddItemToFireBase = () => {
  if (titleEl && priceEl && itemImageEl) {
    db.collection("AddItems")
      .add({
        title: titleEl.value,
        price: priceEl.value,
        name: localStorage.getItem("username"),
        description: descriptionEl.value,
        image: itemImageEl.value,
        user: auth.currentUser.uid,
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert("Item has been added ");

        ReDirectToPage("../olx.html");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
};

const getListing = () => {
  db.collection("AddItems").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        addCard(change.doc);
      }
    });
  });
};

const addCard = (e) => {
  const CardObj = e.data();
  CardObj.id = e.id;
  const { user, id, title, price, image, description, name } = CardObj;
  console.log(id);

  let cards = document.createElement("div");
  cards.className =
    "group relative rounded-2xl overflow-hidden  transition-all duration-300";
  cards.innerHTML = `
   <div
    class="group relative w-full max-w-sm min-h-[450px] flex flex-col justify-between rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-gradient-to-b from-slate-900 to-gray-800 transition-all duration-300 hover:scale-[1.02]"
  >
    <img
      src="${image}"
      alt="${title} image"
      class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div class="p-5 flex flex-col gap-2 flex-1">
      <h3 class="text-lg font-semibold text-indigo-500">${title}</h3>
      <p class="text-sm text-white h-[48px] overflow-hidden leading-tight">
        ${description}
      </p>

      <div class="mt-auto pt-3 text-white font-medium">
        <span>Rs ${Math.ceil(price)}</span>
      </div>

      <h3 class="text-lg font-semibold text-indigo-500">
        Seller name:
        <span class="text-white capitalize">${name}</span>
      </h3>

      <button
        onclick="AddToCart(${user})"
        id="${userid}"
        class="mt-3 px-4 py-2 bg-gradient-to-r from-slate-700 to-stone-900 text-white text-sm font-semibold rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all border border-white/10 shadow-md"
      >
        Add to Cart
      </button>
    </div>
  </div>`;
  DivCards.append(cards);
};

const AddToCart = (id) => {
  console.log(id);
};
