
function loadPage(page) {
    $.ajax({
        url: '/product?page=' + page,
        type: get,
    })
        .then(data => {

        })

        .catch()
}