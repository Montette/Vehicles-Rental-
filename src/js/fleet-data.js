
export const getData = () => fetch('https://vehicles-989f1.firebaseio.com/vehicles.json')
    .then(response => {
        if(response.ok) {
            return response.json()
        } else {
            throw new Error();
        }
    })
    .catch(err => {
        console.log(err);
    })