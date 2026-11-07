const cartCount = document.getElementById("cartCount")
const cartItems = document.getElementById("cartItems")
const cartTable = document.getElementById("cartTable")
const emptyCart = document.getElementById("emptyCart")
const cartTotal = document.getElementById("cartTotal")
const cartNotice = document.getElementById("cartNotice")
const checkoutForm = document.getElementById("checkoutForm")
const paymentMethod = document.getElementById("paymentMethod")
const orderStatus = document.getElementById("orderStatus")
const addButtons = document.querySelectorAll("[data-game-id]")

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("nexplayCart"))
        if (Array.isArray(cart)) {
            return cart
        }
    } catch {
    }
    return []
}

function saveCart(cart) {
    localStorage.setItem("nexplayCart", JSON.stringify(cart))
    displayCart()
}

function showPrice(price) {
    return "$" + (price / 100).toFixed(2)
}

function addToCart(id, name, price) {
    const cart = getCart()
    const game = cart.find(item => item.id === id)

    if (game) {
        game.quantity = game.quantity + 1
    } else {
        cart.push({ id: id, name: name, price: price, quantity: 1 })
    }

    saveCart(cart)
    cartNotice.textContent = name + " added to cart. Items in cart: " + cartCount.textContent
}

function deleteItem(id) {
    const cart = getCart()
    const newCart = cart.filter(item => item.id !== id)
    orderStatus.textContent = ""
    saveCart(newCart)
}

function addCell(row, text) {
    const cell = document.createElement("td")
    cell.textContent = text
    row.appendChild(cell)
    return cell
}

function displayCart() {
    const cart = getCart()
    let count = 0
    cart.forEach(item => {
        count = count + item.quantity
    })
    cartCount.textContent = count

    if (!cartItems) {
        return
    }

    cartItems.textContent = ""
    let total = 0

    cart.forEach(item => {
        const row = document.createElement("tr")
        const subtotal = item.price * item.quantity
        total = total + subtotal

        addCell(row, item.name)
        addCell(row, showPrice(item.price))
        addCell(row, item.quantity)
        addCell(row, showPrice(subtotal))

        const deleteBtn = document.createElement("button")
        deleteBtn.type = "button"
        deleteBtn.textContent = "Remove"
        deleteBtn.className = "btn btn-sm btn-outline-light"
        deleteBtn.setAttribute("aria-label", "Remove " + item.name)
        deleteBtn.addEventListener("click", () => deleteItem(item.id))
        const actionCell = addCell(row, "")
        actionCell.appendChild(deleteBtn)
        cartItems.appendChild(row)
    })

    cartTotal.textContent = showPrice(total)
    cartTable.hidden = cart.length === 0
    emptyCart.hidden = cart.length > 0
    checkoutForm.querySelector("button").disabled = cart.length === 0
}

addButtons.forEach(button => {
    button.addEventListener("click", () => {
        const id = button.getAttribute("data-game-id")
        const price = Number(button.getAttribute("data-price"))
        const name = button.closest(".game-card").querySelector(".card-title").textContent
        addToCart(id, name, price)
    })
})

if (checkoutForm) {
    checkoutForm.addEventListener("submit", event => {
        event.preventDefault()
        const method = paymentMethod.value
        if (!method || getCart().length === 0) {
            return
        }

        const total = cartTotal.textContent
        saveCart([])
        checkoutForm.reset()
        orderStatus.textContent = "Demo order placed for " + total + " using " + method + "."
    })
}

window.addEventListener("pageshow", displayCart)
window.addEventListener("storage", displayCart)
displayCart()