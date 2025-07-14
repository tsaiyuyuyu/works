// ✅ 共用：載入 header.html 並執行分類功能
fetch("header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
    setupFilterButtons();
    setupHamburgerMenu();
  });

// ✅ 共用：載入 footer.html
fetch("footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

// ✅ 功能：設定分類按鈕的點擊事件
function setupFilterButtons() {
  const buttons = document.querySelectorAll(".filter-buttons button");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      const allItemContainer = document.getElementById("all-items");

      if (allItemContainer) {
        // 是 index.html 頁面
        showItems(category);
        history.replaceState(null, "", `?filter=${category}`);
      } else {
        // 其他頁面，導回 index 並附帶篩選參數
        window.location.href = `index.html?filter=${category}`;
      }
    });
  });
}

// ✅ 功能：從網址取得分類參數
function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ✅ 功能：依照分類顯示圖片
function showItems(category) {
  const columns = [
    document.getElementById("col1"),
    document.getElementById("col2"),
    document.getElementById("col3"),
  ];
  const allItemContainer = document.getElementById("all-items");
  if (!allItemContainer) return;

  columns.forEach((col) => (col.innerHTML = ""));

  const allItems = Array.from(allItemContainer.children);
  const visibleItems = allItems.filter(
    (item) => category === "all" || item.dataset.category === category
  );

  const clones = visibleItems.map((item) => item.cloneNode(true));
  clones.forEach((item, index) => {
    columns[index % 3].appendChild(item);
  });

  // ✅ 初始化滾動浮現動畫
  observeFadeIn();
}

// ✅ 功能：滾動浮現動畫
function observeFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  document.querySelectorAll(".fade-in-up").forEach((el) => {
    observer.observe(el);
  });
}

// ✅ 首次載入執行（等整體 DOM Ready）
document.addEventListener("DOMContentLoaded", () => {
  const category = getURLParameter("filter") || "all";
  if (document.getElementById("all-items")) {
    showItems(category);
  }else {
    observeFadeIn(); // 分頁沒有 all-items，也要啟動畫面中圖片的浮現動畫
  }
});

function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (!hamburger || !navMenu) return;

  // ✅ 點擊時，切換漢堡 & nav 選單
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // ✅ 點選選單內任一分類 → 自動收起選單 & 漢堡復原
  navMenu.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const currentFile = location.pathname.split("/").pop() || "index.html";
  if (currentFile === "index.html") return;

  fetch("works.json")
    .then((res) => res.json())
    .then((pages) => {
      const pageFiles = pages.map((p) => p.file);
      const currentIndex = pageFiles.indexOf(currentFile);
      const nextFile = pageFiles[(currentIndex + 1) % pageFiles.length];

      const nextBtn = document.createElement("a");
      nextBtn.href = nextFile;
      nextBtn.className = "next-button";
      nextBtn.textContent = "View next >>";

      const footer = document.querySelector("footer");
      if (footer) {
        footer.appendChild(nextBtn);
      } else {
        console.warn("⚠️ 找不到 <footer>，無法插入 View next 按鈕");
      }
    })
    .catch((error) => {
      console.error("無法載入作品清單 works.json:", error);
    });
});



document.addEventListener("DOMContentLoaded", () => {
  const transition = document.getElementById("page-transition");
  const links = document.querySelectorAll("a:not([target]):not([href^='#'])");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.href;

      // 顯示轉場
      transition.classList.add("active");

      // 延遲導頁（建議 800ms～1200ms）
      setTimeout(() => {
        window.location.href = href;
      }, 1000);
    });
  });
});



