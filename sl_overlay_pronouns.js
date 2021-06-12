const pronouns_lookup = {};
const user_pronouns = {};


function get(endpoint) {
	return fetch(`https://pronouns.alejo.io/api/${endpoint}`).then(resp => resp.json());
}


async function build_pronoun_lookup() {
  const data = await get('pronouns');
  if ( Array.isArray(data) ) {
			for(const item of data) {
				pronouns_lookup[item.name] = item.display;
			}
		}
}


async function get_user_pronouns(user_login) {
  const data = await get(`users/${user_login}`);
  if ( Array.isArray(data) ) {
    if( data.length == 1) {
      pronoun_id = data[0]['pronoun_id'];
    } else {
      pronoun_id = null;
    }
  } else {
    pronoun_id = null;
  }
  if (pronoun_id in pronouns_lookup) {
    user_pronouns[user_login]['pronouns'] = pronouns_lookup[pronoun_id];
  } else {
    user_pronouns[user_login]['pronouns'] = '';
  }
}


function add_user_pronoun_cache(user_login) {
  const ret_obj = {}
  ret_obj['cache_time'] = Date.now();
  ret_obj['pronouns'] = '';
  console.log(`caching ${user_login} pronouns - ${ret_obj['pronouns']}`)
  return ret_obj
}


function update_user_pronoun_cache(user_login) {
  user_pronouns[user_login]['cache_time'] = Date.now();
  console.log(`Refreshing cache for  ${user_login}`)
}


function check_cache_time(user_login) {
  if ( Date.now() <= user_pronouns[user_login]['cache_time'] + 300000 ) {
    return true;
  } else {
    return false;
  };
}


// Please use event listeners to run functions.
document.addEventListener('onLoad', function(obj) {
	// obj will be empty for chat widget
	// this will fire only once when the widget loads
	build_pronoun_lookup();
});


document.addEventListener('onEventReceived', function(obj) {
  // obj will contain information about the event
  // First we only take action on a message	
  if (obj['detail']['command'] === 'PRIVMSG') {
		//Get the user's login from the message
    const user_login = obj['detail']['from'];
    // Check if they do not exist in the local cache and get them if not
    if (!(user_login in user_pronouns)) {
      console.log(`${user_login} is not in pronoun cache`);
      user_pronouns[user_login] = add_user_pronoun_cache(user_login);
      get_user_pronouns(user_login);
    };
    // Check if the cache has expired (5 mins) and refresh their entry if they have
    if (!(check_cache_time(user_login))) {
      console.log(`${user_login} cache has expired`);
			update_user_pronoun_cache(user_login);
      get_user_pronouns(user_login);
    };
    // Find the messageId to write the pronouns to
    const messageId = obj['detail']['messageId'];
    const messageDiv = document.querySelector(`[data-id="${messageId}"]`);
    const pronounSpan = messageDiv.querySelector(".pronouns");
    if (user_pronouns[user_login]['pronouns'] != '') {
      pronounSpan.textContent = `(${user_pronouns[user_login]['pronouns']})`;
    }
	}
});
