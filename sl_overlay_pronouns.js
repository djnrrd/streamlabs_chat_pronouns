let pronouns_lookup = {};
let user_pronouns = {};


function get(endpoint) {
    console.log(`Fetching endpoint - ${endpoint}`);
    return fetch(`https://api.pronouns.alejo.io/v1/${endpoint}`).then(resp => resp.json());
}


async function build_pronoun_lookup() {
    const data = await get('pronouns');
    if (
        typeof data === 'object' &&
        !Array.isArray(data) &&
        data !== null) 
    {
        lookup = Object.assign(pronouns_lookup, data);
        console.log(`pronouns_lookup table ${JSON.stringify(pronouns_lookup)}`);
    }
}


function pronouns_as_string(pronoun_id) {
    console.log(`converting ${pronoun_id} to string`);
    if (pronoun_id in pronouns_lookup) {
        if (pronouns_lookup[pronoun_id]['singular'] == true) {
            console.log("Singular pronoun");
            return pronouns_lookup[pronoun_id]['subject'];
        } else {
            console.log("Regular pronouns");
            return pronouns_lookup[pronoun_id]['subject'] + "/" + pronouns_lookup[pronoun_id]['object'];
        }
    } else {
        return '';
    }
}


function user_pronoun_string(user_object) {
    if (user_object.alt_pronoun_id === null) {
        console.log("Only one set of pronouns");
        return pronouns_as_string(user_object.pronoun_id)
    } else {
        console.log("Alternate set of pronouns");
        return pronouns_as_string(user_object.pronoun_id) + " " + pronouns_as_string(user_object.alt_pronoun_id)
    }
}


async function get_user_pronouns(user_login, messageId) {
    console.log('Looking up user pronouns');
    let user_object = await get(`users/${user_login}`);
    console.log(JSON.stringify(user_object));
    if (
        typeof user_object === 'object' &&
        !Array.isArray(user_object) &&
        user_object !== null) 
    {
        user_pronouns[user_login]['pronouns'] = user_pronoun_string(user_object);
        console.log(JSON.stringify(user_pronouns[user_login]));
    } else {
        user_pronouns[user_login]['pronouns'] = '';
    };
    write_pronouns(messageId, user_login)
}


function add_user_pronoun_cache(user_login) {
    let ret_obj = {}
    ret_obj['cache_time'] = Date.now();
    ret_obj['pronouns'] = '';
    console.log(`caching ${user_login} pronouns - ${ret_obj['pronouns']}`)
    return ret_obj
}


function update_user_pronoun_cache(user_login) {
    user_pronouns[user_login]['cache_time'] = Date.now();
    console.log(`Refreshing cache for ${user_login}`)
}


function check_cache_time(user_login) {
    if ( Date.now() <= user_pronouns[user_login]['cache_time'] + 300000 ) {
        return true;
    } else {
        return false;
    };
}


function write_pronouns(messageId, user_login) {
    const messageDiv = document.querySelector(`[data-id="${messageId}"]`);
    const pronounSpan = messageDiv.querySelector(".pronouns");
    console.log(user_pronouns[user_login]['pronouns']);
    if (user_pronouns[user_login]['pronouns'] != '') {
        pronounSpan.textContent = `(${user_pronouns[user_login]['pronouns']})`;
    }
}




// Please use event listeners to run functions.
document.addEventListener('onLoad', function(obj) {
	// obj will be empty for chat widget
	// this will fire only once when the widget loads
    build_pronoun_lookup()
});


document.addEventListener('onEventReceived', function(obj) {
    // obj will contain information about the event
    // First we only take action on a message	
    if (obj['detail']['command'] === 'PRIVMSG') {
        //Get the user's login from the message
        let user_login = obj['detail']['from'];
		// Find the messageId to write the pronouns to
        let messageId = obj['detail']['messageId'];
        // Check if they do not exist in the local cache and get them if not
        if (!(user_login in user_pronouns)) {
          console.log(`${user_login} is not in pronoun cache`);
          user_pronouns[user_login] = add_user_pronoun_cache(user_login);
          get_user_pronouns(user_login, messageId);
        };
        // Check if the cache has expired (5 mins) and refresh their entry if they have
        if (!(check_cache_time(user_login))) {
            console.log(`${user_login} cache has expired`);
		    update_user_pronoun_cache(user_login);
            get_user_pronouns(user_login, messageId);
        };
		write_pronouns(messageId, user_login);
    }
});
