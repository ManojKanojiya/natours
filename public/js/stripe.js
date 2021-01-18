import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51Gx8xsLHCc9Ph2eOAOqYZiy2FecxMfsIDrR8J3DD5jZhkdGslaUJ6nfWNYFkTSpSxhnDXr3LRFWKT9AQPT59Bmqe00TBedj2xu');

export const bookTour = async tourId => {
    try {
        const session = await axios({
            url: `http://127.0.0.1:5000/api/v1/bookings/checkout-session/${tourId}`,
            method: 'GET'
        })
        console.log(session);
        console.log(session.data);
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        showAlert('error', err.response.data.message);
    }


}