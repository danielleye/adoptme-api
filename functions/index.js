const functions = require('firebase-functions')
const axios = require('axios')

function getAPITokenFromDB() {
    // FiresStore read token
    const accessToken = null
    return accessToken || null
}

function getAPIToken(clientId, clientSecret) {
    const url = `https://api.petfinder.com/v2/oauth2/token`

    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append(
        'client_id',
        'QZ9z3DRjL5XIyvEXixqz4PlHkJcLMagowbA1B7mASoVwgJe7RU'
    )
    params.append('client_secret', 'n6aSC1Oz0FUJFVLyzztMx6saU2xhgKrCbAUgaBYr')

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }

    return axios
        .post(url, params, config)
        .then((result) => {
            // token_type, expires_in, access_token
            // access_token write it to FiresStore (db)
            console.log(result)
            return result.data.access_token
        })
        .catch((err) => {
            // report logging error
            response.send('failed api token')
        })
}

exports.adoptPetProxy = functions.https.onRequest(async (request, response) => {
    const jwt = await (getAPITokenFromDB() || getAPIToken())

    const config = {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    }

    return axios
        .get(
            `https://api.petfinder.com/v2/animals?type=${type}&location=${location}`,
            config
        )
        .then((result) => {
            console.log(result.data)
            response.send(result.data)
        })
        .catch((err) => {
            // report logging error
            response.send('failed animals')
        })
})

// $ firebase deploy
