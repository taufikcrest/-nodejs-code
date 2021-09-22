const Klaviyo = require('node-klaviyo');
const config = require('../config');
const _ = require("lodash");

/**
* @method getKlaviyoObject
* @description generate klaviyo object
* @returns klaviyo object to call apis
*/
const getKlaviyoObject = () => {
    return new Klaviyo({
        publicToken: config.klaviyo.publicToken,
        privateToken: config.klaviyo.privateToken
    });
}

/**
* @method createKlaviyoProfile
* @description generate klaviyo profile
* @params email, firsname, lastname, phonenumber of the user
*/
exports.createKlaviyoProfile = (email, firstName, lastName, phoneNumber) => {
    const KlaviyoClient = getKlaviyoObject();
    KlaviyoClient.public.identify({
        email: email,
        properties: {
            $first_name: firstName,
            $last_name: lastName,
            $phone_number: phoneNumber
        },
        post: true
    });
}

/**
* @method createKlaviyoEvent
* @description generate klaviyo event
* @params email, eventName and metadata
*/
exports.createKlaviyoEvent = (email, eventName, metadata = false) => {
    const KlaviyoClient = getKlaviyoObject();
    KlaviyoClient.public.track({
        event: eventName,
        email: email,
        properties: !_.isEmpty(metadata) ? metadata : {}
    })
}