export function PP_ProductCheckout(productId, baseUrl) {
    localStorage.setItem('strapiPaypalUrl', baseUrl);
    const getProductApi = baseUrl + '/strapi-paypal/getPaypalCheckout/' + productId;
    // const checkoutSessionUrl = baseUrl + "/strapi-paypal/createCheckoutSession/";

    fetch(getProductApi, {
        method: 'get',
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
    })
        .then(response => response.json())
        .then(response => {
            if (response.id) {
                const filter = response.links.filter(links => links.rel === 'approve');
                console.log(response, filter)
                window.location.replace(filter[0].href);
            }
        });
}