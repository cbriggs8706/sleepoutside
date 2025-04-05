import { findProductById } from "./externalServices.mjs";
import {
  alertMessage,
  getLocalStorage,
  setLocalStorage,
  updateCartBadge,
} from "./utils.mjs";
import showBreadcrumb from "./breadcrumb.js";

let product = {};

export default async function productDetails(productId) {
  try {
    product = await findProductById(productId);
    console.log("Loaded product:", product);

    if (!product || !product.Id) throw new Error("Product not found");

    renderProductDetails();
    document.getElementById("addToCart").addEventListener("click", addToCart);
  } catch (error) {
    console.error("Error loading product:", error);
    const container = document.querySelector(".product-detail");
    container.innerHTML = `
      <h2 class="error">Product Not Found</h2>
      <p>Sorry, we couldn't find the product you're looking for.</p>
    `;
  }
}

function addToCart() {
  let cartContents = getLocalStorage("so-cart") || [];
  const existingItemIndex = cartContents.findIndex(
    (item) => item.Id === product.Id
  );

  if (existingItemIndex > -1) {
    cartContents[existingItemIndex].Quantity =
      (cartContents[existingItemIndex].Quantity || 1) + 1;
  } else {
    product.Quantity = 1;
    cartContents.push(product);
  }

  setLocalStorage("so-cart", cartContents);
  alertMessage(`${product.NameWithoutBrand} added to cart!`);
  updateCartBadge();
}

function updateMainImage(imageObj, altText) {
  const img = document.getElementById("productImage");
  img.src = imageObj.PrimaryExtraLarge || imageObj.PrimaryLarge;
  img.alt = altText;
  img.srcset = `
    ${imageObj.PrimarySmall} 480w,
    ${imageObj.PrimaryMedium} 800w,
    ${imageObj.PrimaryLarge} 1200w,
    ${imageObj.PrimaryExtraLarge} 1600w
  `;
  img.sizes = "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw";
}

function renderProductDetails() {
  document.querySelector("#productName").innerText = product.Brand.Name;
  document.querySelector("#productNameWithoutBrand").innerText =
    product.NameWithoutBrand;

  updateMainImage(product.Images, product.Name);

  const original = product.SuggestedRetailPrice;
  const final = product.FinalPrice;
  const hasDiscount = original > final;
  const discountPercent = hasDiscount
    ? Math.round(((original - final) / original) * 100)
    : 0;

  const discountFlag = document.getElementById("discount-flag");
  if (hasDiscount && discountFlag) {
    discountFlag.textContent = `${discountPercent}% OFF`;
    discountFlag.style.display = "block";
  }

  document.querySelector("#productPriceDisplay").innerHTML = `
    ${
      hasDiscount
        ? `<span class="original-price">$${original.toFixed(2)}</span>`
        : ""
    }
    <span class="final-price">$${final.toFixed(2)}</span>
    ${
      hasDiscount
        ? `<span class="discount-badge">${discountPercent}% OFF</span>`
        : ""
    }
  `;

  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;
  document
    .getElementById("addToWishlist")
    .addEventListener("click", addToWishlist);

  const colorContainer = document.getElementById("productColors");
  if (product.Colors?.length > 1) {
    colorContainer.innerHTML = product.Colors.map(
      (color, index) => `
      <div class="swatch-wrapper ${
        index === 0 ? "selected" : ""
      }" data-index="${index}">
        <img src="${color.ColorPreviewImageSrc}" alt="${
        color.ColorName
      }" class="color-swatch" title="${color.ColorName}" />
      </div>
    `
    ).join("");
  } else {
    colorContainer.innerHTML = `<p>${product.Colors[0].ColorName}</p>`;
  }

  colorContainer.addEventListener("click", (e) => {
    const wrapper = e.target.closest(".swatch-wrapper");
    if (!wrapper) return;

    document
      .querySelectorAll(".swatch-wrapper")
      .forEach((el) => el.classList.remove("selected"));
    wrapper.classList.add("selected");

    const selectedIndex = wrapper.dataset.index;
    const selectedColor = product.Colors[selectedIndex];
    product.SelectedColor = selectedColor;

    const colorCode = selectedColor.ColorCode;

    const { Images } = product;
    const imageMatchesCode =
      Images.PrimaryExtraLarge?.includes(`_${colorCode}~`) ||
      Images.PrimaryLarge?.includes(`_${colorCode}~`);

    const img = document.getElementById("productImage");

    if (imageMatchesCode) {
      img.src = Images.PrimaryExtraLarge;
      img.alt = `${product.NameWithoutBrand} in ${selectedColor.ColorName}`;
      img.srcset = `
        ${Images.PrimarySmall} 480w,
        ${Images.PrimaryMedium} 800w,
        ${Images.PrimaryLarge} 1200w,
        ${Images.PrimaryExtraLarge} 1600w
      `;
      img.sizes = "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw";
    } else {
      img.src = selectedColor.ColorPreviewImageSrc;
      img.alt = `${product.NameWithoutBrand} in ${selectedColor.ColorName}`;
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      console.warn(
        "No matching high-res image found, falling back to preview."
      );
    }

    console.log("Swatch clicked:", selectedColor);
  });

  if (product.Images?.ExtraImages?.length > 0) {
    const thumbContainer = document.createElement("div");
    thumbContainer.classList.add("thumbnail-row");

    product.Images.ExtraImages.forEach((extra, i) => {
      const thumb = document.createElement("img");
      thumb.classList.add("thumbnail");
      thumb.src = extra.Src;
      thumb.alt = extra.Title || `Extra image ${i + 1}`;

      thumb.addEventListener("click", () => {
        const mainImg = document.getElementById("productImage");
        mainImg.src = extra.Src;
        mainImg.alt = extra.Title || `Extra image ${i + 1}`;
        mainImg.removeAttribute("srcset");
      });

      thumbContainer.appendChild(thumb);
    });

    document
      .querySelector(".product-image-container")
      .appendChild(thumbContainer);
  }

  product.SelectedColor = product.Colors[0];
  document.getElementById("addToCart").dataset.id = product.Id;

  showBreadcrumb({
    type: "product",
    category: product.Category,
    productName: product.NameWithoutBrand,
  });
}

function addToWishlist() {
  let wishlist = getLocalStorage("so-wishlist") || [];
  const exists = wishlist.find((item) => item.Id === product.Id);

  if (!exists) {
    wishlist.push(product);
    setLocalStorage("so-wishlist", wishlist);
    alertMessage(`${product.NameWithoutBrand} added to your wishlist!`);
  } else {
    alertMessage(`${product.NameWithoutBrand} is already in your wishlist.`);
  }
}
