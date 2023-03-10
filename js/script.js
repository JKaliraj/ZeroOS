const body = document.querySelector("body"),
  main = body.querySelector(".main"),
  container = body.querySelector(".container"),
  sidebar = document.querySelector(".sidebar"),
  sidebarHome = document.querySelector(".sidebarHome"),
  sidebarFile = document.querySelector(".sidebarFile"),
  sidebarPhotos = document.querySelector(".sidebarPhotos"),
  sidebarEditor = document.querySelector(".sidebarEditor"),
  sidebarShare = document.querySelector(".sidebarShare"),
  sidebarWindows = document.querySelector(".sidebarWindows"),
  sidebarWindowsMenu = document.querySelector(".sidebarWindowsMenu"),
  boxes = document.querySelectorAll(".boxes"),
  contextMenu = document.querySelector(".context-menu"),
  maximizeWindow = document.querySelector(".context-menu #maximizeWindow"),
  refreshDesktop = document.querySelector(".context-menu #refresh"),
  zeroStore = document.querySelector(".zeroStore"),
  appInstallWindow = document.querySelector(".appInstallWindow"),
  appStoreGames = document.querySelector(".appStoreGames"),
  appInstallToMain = document.querySelector(".appInstallToMain"),
  aboutContextMenu = document.querySelector(".aboutContextMenu"),
  filemanager = document.querySelector(".filemanager"),
  backgroundChanger = document.querySelector(".BackgroundWin"),
  backgroundContent = document.querySelector("#bckwin");

const loginMain = document.querySelector(".loginMain"),
  signinDiv = document.querySelector(".signin"),
  signinRow = document.querySelector(".signinRow"),
  usernameInput = signinRow.querySelector("#signinUser"),
  passwordInput = signinRow.querySelector("#signinPass"),
  signinButton = signinRow.querySelector(".signinButton"),
  signupDiv = document.querySelector(".signup"),
  signupUserPic = signupDiv.querySelector(".signupUserPic"),
  signupUser = signupDiv.querySelector("#signupUser"),
  signupPass = signupDiv.querySelector("#signupPass"),
  signupCPass = signupDiv.querySelector("#signupCPass"),
  signupButton = signupDiv.querySelector(".signupButton");

// Development Begin
container.style.display = "flex";
document.querySelector(".loginMain").style.opacity = "0";
document.querySelector("#splash").style.display = "none";
document.querySelector(".loginMain").style.display = "none";
document.querySelector(".container").style.display = "flex";
// End (Remove this in production)

// Login Start
var username = localStorage.getItem("username");
var password = localStorage.getItem("password");
if (username) {
  usernameInput.value = username;
}
// wait(2000).then(() => {
//   document.querySelector("#splash").style.display = "none";
//   document.querySelector(".loginMain").style.opacity = "1";
//   document.querySelector(".loginMain").style.display = "flex";
//   document.querySelector("#signinUser").focus();
// });

function login() {
  var pass = passwordInput.value;
  var user = usernameInput.value;
  if (pass.length != 0) {
    signinButton.classList.toggle("loading");
    db.ref("users/")
      .child(user)
      .once("value", (snap) => {
        var data = snap.val();
        if (data != null) {
          var md5pass = md5(pass);
          if (md5pass == data["password"]) {
            username = user;
            password = pass;
            // Load Wallpaper
            db.ref("users/" + user + "/settings/wallpaper/").once("value", (snap) => {
              var data = snap.val();
              $('.container').css('background-image', 'url(' + data['wallpaper'] + ')');
            })
            // load desktop icons start
            db.ref("users/" + user + "/desktop/").on("child_added", (snap) => {
              var data = snap.val();
              var htmlTemplate = `<div class="appsIcon ${data["id"]}" onclick="openApp('${data["code"]}')">
              <img src="${data["image"]}" alt="">
              <p>${data["name"]}</p>
              </div> `;
              main.innerHTML += htmlTemplate;
            });
            db.ref("users/" + user + "/desktop/").on(
              "child_removed",
              (snap) => {
                var data = snap.val();
                document.querySelector(`.${data["id"]}`).remove();
              }
            );
            // load desktop icons end
            localStorage.setItem("username", user);
            localStorage.setItem("password", md5pass);
            container.style.display = "flex";
            document.querySelector(".loginMain").style.opacity = "0";
            document.querySelector(".loginMain").style.display = "none";
          } else {
            passwordInput.value = "";
            passwordInput.focus();
            showPasswordInput();
            signinButton.classList.toggle("loading");
            document.querySelector("#alert-text").textContent =
              "Wrong Password";
            document.querySelector(".alert").classList.toggle("alertnow");
            wait(3000).then(() => {
              document.querySelector(".alert").classList.toggle("alertnow");
            });
          }
        } else {
          signinButton.classList.remove("loading");
          document.querySelector("#alert-text").textContent =
            "Invalid User Credentials";
          document.querySelector(".alert").classList.toggle("alertnow");
          wait(3000).then(() => {
            document.querySelector(".alert").classList.toggle("alertnow");
          });

          showuserInput();
        }
      });
  }
}
function showPasswordInput() {
  passwordInput.value = "";
  if (usernameInput.value.length >= 3) {
    signinButton.classList.add("activeSignin");
    passwordInput.focus();
    signinButton.setAttribute("onclick", "showuserInput()");
    usernameInput.style = "position:absolute;z-index:-999;opacity:0";
    passwordInput.style = "position:relative;z-index:999;opacity:1";
  }
}
function showuserInput() {
  signinButton.classList.remove("activeSignin");
  signinButton.setAttribute("onclick", "showPasswordInput()");
  passwordInput.style = "position:relative;z-index:-999;opacity:0";
  usernameInput.style = "position:absolute;z-index:999;opacity:1";
  usernameInput.focus();
}
function signinPassKeyPressed() {
  var usernameInputLen = signinRow.querySelector("#signinUser");
  var passwordInputLen = signinRow.querySelector("#signinPass");

  if (passwordInputLen.value.length == 0) {
    signinButton.classList.add("activeSignin");
    signinButton.setAttribute("onclick", "showuserInput()");
    usernameInput.style = "position:absolute;z-index:-999;opacity:0";
    passwordInput.style = "position:relative;z-index:999;opacity:1";
  }
  if (passwordInputLen.value.length > 0) {
    signinButton.classList.remove("activeSignin");
    signinButton.setAttribute("onclick", "login()");
  }
}

function createNewUser() {
  var user = signupUser.value;
  var pass = signupPass.value;
  var cpass = signupCPass.value;
  var userpic = signupUserPic.src;
  if (user.length > 3 && pass.length > 3 && cpass == pass) {
    db.ref("users/")
      .child(user)
      .once("value", (snap) => {
        var data = snap.val();
        if (data == null) {
          signupButton.innerHTML = "";
          signupButton.classList.toggle("loading");
          cpass = md5(cpass);
          db.ref("users/" + user + "/").set({
            username: user,
            password: cpass,
            image: userpic,
          });
          document.querySelector("#alert-text").textContent =
            "ZeroSoft Account Created Successfully";
          document.querySelector(".alert").classList.toggle("successalertnow");
          signinUser.value = user;
          showExistingAccount();
          wait(3000).then(() => {
            document
              .querySelector(".alert")
              .classList.toggle("successalertnow");
          });
        } else {
          document.querySelector("#alert-text").textContent =
            "Username already taken";
          signupUser.value = "";
          signupPass.value = "";
          signupCPass.value = "";
          signupUser.focus();
          document.querySelector(".alert").classList.toggle("alertnow");
          wait(3000).then(() => {
            document.querySelector(".alert").classList.toggle("alertnow");
          });
        }
      });
  } else {
    signupUser.value = "";
    signupPass.value = "";
    signupCPass.value = "";
    signupUser.focus();
    signupButton.innerHTML = "Create";
    signupButton.classList.remove("loading");
    document.querySelector("#alert-text").textContent = "Invalid Credentials";
    document.querySelector(".alert").classList.toggle("alertnow");
    wait(3000).then(() => {
      document.querySelector(".alert").classList.toggle("alertnow");
    });
  }
}

function showSetupNewAccount() {
  fetch("https://random.imagecdn.app/v1/image?width=450&height=450&format=json")
    .then((response) => response.json())
    .then((data) => {
      signupUserPic.setAttribute("src", data.url);
    });
  signupUser.value = "";
  signupPass.value = "";
  signupCPass.value = "";
  signupDiv.style.display = "flex";
  signinDiv.style.display = "none";
  signupUser.focus();
  signupButton.innerHTML = "Create";
  signupButton.classList.remove("loading");
}
function showExistingAccount() {
  showuserInput();
  signinDiv.style.display = "flex";
  signupDiv.style.display = "none";
  signinUser.focus();
}

// Login End

function openApp(appcode) {
  db.ref("users/" + username + "/desktop/" + appcode + "/").once(
    "value",
    (snap) => {
      var data = snap.val();
      new WinBox(`${data["name"]}`, {
        root: document.querySelector(".main"),
        icon: data["image"],
        left: 70,
        x: "center",
        y: "center",
        width: 500,
        height: 650,
        url: data["url"],
      });
    }
  );
}

// Context Menu Start
const normalizePozition = (mouseX, mouseY) => {
  // ? compute what is the mouse position relative to the container element (scope)
  let { left: scopeOffsetX, top: scopeOffsetY } = main.getBoundingClientRect();

  scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
  scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;

  const scopeX = mouseX - scopeOffsetX;
  const scopeY = mouseY - scopeOffsetY;

  // ? check if the element will go out of bounds
  const outOfBoundsOnX = scopeX + contextMenu.clientWidth > main.clientWidth;

  const outOfBoundsOnY = scopeY + contextMenu.clientHeight > main.clientHeight;

  let normalizedX = mouseX;
  let normalizedY = mouseY;

  // ? normalize on X
  if (outOfBoundsOnX) {
    normalizedX = scopeOffsetX + main.clientWidth - contextMenu.clientWidth;
  }

  // ? normalize on Y
  if (outOfBoundsOnY) {
    normalizedY = scopeOffsetY + main.clientHeight - contextMenu.clientHeight;
  }

  return { normalizedX, normalizedY };
};

main.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  const { clientX: mouseX, clientY: mouseY } = event;

  const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);

  contextMenu.classList.remove("visible");

  contextMenu.style.top = `${normalizedY}px`;
  contextMenu.style.left = `${normalizedX}px`;

  setTimeout(() => {
    contextMenu.classList.add("visible");
  });
});

main.addEventListener("click", (e) => {
  // ? close the menu if the user clicks outside of it
  if (e.target.offsetParent != contextMenu) {
    contextMenu.classList.remove("visible");
  }
  if (e.target.offsetParent != sidebarWindowsMenu) {
    sidebarWindowsMenu.classList.remove("visible");
    sidebarWindowsMenuActive = 0;
  }
});
refreshDesktop.addEventListener("click", () => {
  window.location.reload();
});
contextMenu.addEventListener("click", () => {
  contextMenu.classList.remove("visible");
});

maximizeWindow.addEventListener("click", () => {
  if (body.exitFullscreen) {
		body.exitFullscreen();
	} else {
		body.requestFullscreen();
	}
  
});

// Context Menu End

// Main Menu Start
var sidebarWindowsMenuActive = 0;
sidebarWindows.addEventListener("click", (event) => {
  event.preventDefault();
  if (sidebarWindowsMenuActive == 0) {
    sidebarWindowsMenuActive++;
    const { clientX: mouseX, clientY: mouseY } = event;

    const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);

    sidebarWindowsMenu.classList.remove("visible");

    sidebarWindowsMenu.style.bottom = `0px`;
    sidebarWindowsMenu.style.left = `70px`;

    setTimeout(() => {
      sidebarWindowsMenu.classList.add("visible");
    });
  } else {
    sidebarWindowsMenuActive = 0;
    sidebarWindowsMenu.classList.remove("visible");
  }
});
// Main Menu End

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Desktop Icon Animation Start
function closestEdge(x, y, w, h) {
  var topEdgeDist = distMetric(x, y, w / 2, 0);
  var bottomEdgeDist = distMetric(x, y, w / 2, h);
  var leftEdgeDist = distMetric(x, y, 0, h / 2);
  var rightEdgeDist = distMetric(x, y, w, h / 2);
  var min = Math.min(topEdgeDist, bottomEdgeDist, leftEdgeDist, rightEdgeDist);
  switch (min) {
    case leftEdgeDist:
      return "left";
    case rightEdgeDist:
      return "right";
    case topEdgeDist:
      return "top";
    case bottomEdgeDist:
      return "bottom";
  }
}
function distMetric(x, y, x2, y2) {
  var xDiff = x - x2;
  var yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
}
for (var i = 0; i < boxes.length; i++) {
  boxes[i].onmouseenter = function (e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    var edge = closestEdge(x, y, this.clientWidth, this.clientHeight);
    var overlay = this.childNodes[2];

    switch (edge) {
      case "left":
        //tween overlay from the left
        overlay.style.top = "0%";
        overlay.style.left = "-100%";
        TweenMax.to(overlay, 0.5, { left: "0%" });
        break;
      case "right":
        overlay.style.top = "0%";
        overlay.style.left = "100%";
        //tween overlay from the right
        TweenMax.to(overlay, 0.5, { left: "0%" });
        break;
      case "top":
        overlay.style.top = "-100%";
        overlay.style.left = "0%";
        //tween overlay from the right
        TweenMax.to(overlay, 0.5, { top: "0%" });
        break;
      case "bottom":
        overlay.style.top = "100%";
        overlay.style.left = "0%";
        //tween overlay from the right
        TweenMax.to(overlay, 0.5, { top: "0%" });
        break;
    }
  };

  boxes[i].onmouseleave = function (e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    var edge = closestEdge(x, y, this.clientWidth, this.clientHeight);
    var overlay = this.childNodes[1];

    switch (edge) {
      case "left":
        TweenMax.to(overlay, 0.5, { left: "-100%" });
        break;
      case "right":
        TweenMax.to(overlay, 0.5, { left: "100%" });
        break;
      case "top":
        TweenMax.to(overlay, 0.5, { top: "-100%" });
        break;
      case "bottom":
        TweenMax.to(overlay, 0.5, { top: "100%" });
        break;
    }
  };
}
// Desktop Icon Animation End

// WinBOX Start

// WinBOX End
var filebox;

// Home Start
sidebarHome.addEventListener("click", () => {
  if (sidebarFileActive == 1) {
    filebox.minimize();
    sidebarFileMini = 1;
  }
  if (sidebarShareActive == 1) {
    sharebox.minimize();
    sidebarShareMini = 1;
  }

  document.querySelector(".active").classList.remove("active");
  document.querySelector(".sidebarHome").classList.add("active");
});
// Home End
// File Start
var sidebarFileActive = 0,
  sidebarFileMini = 0;
sidebarFile.addEventListener("click", () => {
  document.querySelector(".active").classList.remove("active");
  sidebarFile.classList.add("active");
  if (sidebarFileActive == 0) {
    sidebarFileActive++;
    filebox = new WinBox("My Files", {
      root: document.querySelector(".container"),
      icon: "assests/folder.png",
      left: 70,
      x: "center",
      y: "center",
      width: "80%",
      height: "80%",
      minwidth: 730,
      minheight: 520,
      class: "filesTheme",
      onclose: function () {
        sidebarFileActive = 0;
        sidebarFileMini = 0;
        document.querySelector(".active").classList.remove("active");
        document.querySelector(".sidebarHome").classList.add("active");
      },
      mount: filemanager,
    });
  }

  if (sidebarFileMini == 1) {
    filebox.restore();
    filebox.focus();
  }

  //  to open a tab content based on file manager  a button click

  const allIndicator = document.querySelectorAll(".indicator li");
  const allContent = document.querySelectorAll(".content li");

  allIndicator.forEach((item) => {
    item.addEventListener("click", function () {
      const content = document.querySelector(this.dataset.target);

      allIndicator.forEach((i) => {
        i.classList.remove("active");
      });

      allContent.forEach((i) => {
        i.classList.remove("active");
      });

      content.classList.add("active");
      this.classList.add("active");
    });
  });

});

// File End
// Share Start
var sharebox;
var sidebarShareActive = 0,
  sidebarShareMini = 0;
sidebarShare.addEventListener("click", () => {
  document.querySelector(".active").classList.remove("active");
  sidebarShare.classList.add("active");
  if (sidebarShareActive == 0) {
    sidebarShareActive++;
    sharebox = new WinBox("ZeroDrop - Secure File Sharing", {
      root: document.querySelector(".container"),
      icon: "assests/share.svg",
      left: 70,
      x: "center",
      y: "center",
      width: 720,
      height: "80%",
      class: "shareTheme",
      onclose: function () {
        sidebarShareActive = 0;
        sidebarShareMini = 0;
        document.querySelector(".active").classList.remove("active");
        document.querySelector(".sidebarHome").classList.add("active");
      },
      url: "https://zerodrop.web.app/",
    });
  }
  if (sidebarShareMini == 1) {
    sharebox.restore();
    sharebox.focus();
  }
});
// Share End
// zeroStore Start
var storeOpenCount = 0;
function openStore() {
  appInstallWindow.classList.remove("appInstallWindowactive");
  document.querySelector(".appInstallWindow .appTitle").innerText = "";
  document.querySelector(".appInstallWindow .appAbout").innerText = "";
  document.querySelector(".appInstallWindow .appHeadLeft img").src = "";
  document.querySelector(".appInstallButton").removeAttribute("onclick");
  if (storeOpenCount == 0) {
    db.ref("store/apps/").once("child_added", (snap) => {
      var data = snap.val();
      var htmlTemplate = ` <div class="appbox" onclick="showAppToInstall('${data["code"]}')">
    <img src="${data["image"]}" alt="">
    <p>${data["name"]}</p>
  </div>`;

      document.querySelector(".appStoreMainBody .section .row").innerHTML +=
        htmlTemplate;
    });
    storeOpenCount++;
  }
  new WinBox("Zero Store", {
    root: document.querySelector(".container"),
    icon: "assests/app-store.png",
    left: 70,
    x: "center",
    y: "center",
    width: "80%",
    height: "95%",
    class: "storeTheme",
    mount: document.getElementById("appStoreMain"),
  });
}

appStoreGames.addEventListener("click", () => { });

function showAppToInstall(appid) {
  appInstallToMain.addEventListener("click", () => {
    appInstallWindow.classList.remove("appInstallWindowactive");
    document.querySelector(".appInstallWindow .appTitle").innerText = "";
    document.querySelector(".appInstallWindow .appAbout").innerText = "";
    document.querySelector(".appInstallWindow .appHeadLeft img").src = "";
    document.querySelector(".appInstallButton").removeAttribute("onclick");
  });

  db.ref("users/" + username + "/desktop/").once("value", (snap) => {
    if (snap.hasChild(appid)) {
      document.querySelector(".appInstallButton").innerText = "Uninstall";
      document.querySelector(".appInstallButton").style.background =
        "#d11111da";
      document.querySelector(".appInstallButton").removeAttribute("onclick");

      db.ref("store/apps/" + appid + "/").once("value", (snap) => {
        var data = snap.val();
        document
          .querySelector(".appInstallWindow .appInstallButton")
          .setAttribute(
            "onclick",
            `uninstallApp('${appid}','${data["name"]}','${data["image"]}','${data["url"]}'),'${data["uniquecode"]}'`
          );
        document.querySelector(".appInstallWindow .appTitle").innerText =
          data["name"];
        document.querySelector(".appInstallWindow .appAbout").innerText =
          data["about"];
        document.querySelector(".appInstallWindow .appHeadLeft img").src =
          data["image"];
        appInstallWindow.classList.add("appInstallWindowactive");
      });
    } else {
      document.querySelector(".appInstallButton").innerText = "Install";
      document.querySelector(".appInstallButton").style.background =
        "#03d827e7";

      db.ref("store/apps/" + appid + "/").once("value", (snap) => {
        var data = snap.val();
        document.querySelector(".appInstallWindow .appTitle").innerText =
          data["name"];
        document.querySelector(".appInstallWindow .appAbout").innerText =
          data["about"];
        document.querySelector(".appInstallWindow .appHeadLeft img").src =
          data["image"];
        document
          .querySelector(".appInstallWindow .appInstallButton")
          .setAttribute(
            "onclick",
            `installApp('${appid}','${data["name"]}','${data["image"]}','${data["url"]}','${data["uniquecode"]}')`
          );
        appInstallWindow.classList.add("appInstallWindowactive");
      });
    }
  });
}

function installApp(appid, appname, appimage, appurl, uniquecode) {
  db.ref("users/" + username + "/desktop/" + appid + "/").set({
    code: appid,
    id: uniquecode,
    image: appimage,
    name: appname,
    url: appurl,
  });
  document.querySelector(".appInstallButton").innerText = "Uninstall";
  document.querySelector(".appInstallButton").style.background = "#d11111da";
  document.querySelector(".appInstallButton").removeAttribute("onclick");
  document
    .querySelector(".appInstallWindow .appInstallButton")
    .setAttribute(
      "onclick",
      `uninstallApp('${appid}','${appname}','${appimage}','${appurl}','${uniquecode}')`
    );
}
function uninstallApp(appid, appname, appimage, appurl, uniquecode) {
  db.ref("users/" + username + "/desktop/" + appid + "/").remove();
  document.querySelector(".appInstallButton").innerText = "Install";
  document.querySelector(".appInstallButton").style.background = "#03d827e7";
  document.querySelector(".appInstallButton").removeAttribute("onclick");
  document
    .querySelector(".appInstallWindow .appInstallButton")
    .setAttribute(
      "onclick",
      `installApp('${appid}','${appname}','${appimage}','${appurl}','${uniquecode}')`
    );
}
// zeroStore End
// About Start
aboutContextMenu.addEventListener("click", () => {
  sidebarWindowsMenu.classList.remove("visible");
  sidebarWindowsMenuActive = 0;
  new WinBox("About", {
    root: document.querySelector(".container"),
    left: 70,
    x: "center",
    y: "center",
    width: "100%",
    height: "100%",
    class: "aboutTheme",
    maxheight: 450,
    maxwidth: 450,
    minheight: 450,
    minwidth: 450,
    mount: document.getElementById("aboutMain"),
  });
});
// About End
// Background Start

backgroundChanger.addEventListener("click", () => {
  const backgroundBox = new WinBox({
    root: document.querySelector(".container"),
    title: "Background",
    icon: "assests/background.svg",
    left: 70,
    x: "center",
    y: "center",
    width: "60%",
    height: "75%",
    mount: backgroundContent,
    modal: true
  });
});

function showFullPreview(data) {
  data.classList.toggle("bckimages");
  data.classList.toggle("bckimagesActive");
}
function closeFullPreview() {
  showFullPreview(document.querySelector(".bckimagesActive"));
}
function applyWallpaper(wallpaper){
  $('.container').css('background-image', 'url(' + wallpaper + ')');
  db.ref("users/" + user + "/settings/wallpaper/").update({
    wallpaper:wallpaper,
  });
}

// Background End
