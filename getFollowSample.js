// Fetch the users being followed by a specific account, by ID
// https://developer.twitter.com/en/docs/twitter-api/users/follows/quick-start

//const needle = require('needle');
import needle from "needle";

// this is the ID for @TwitterDev
const userId = 821681435140562946n;
const url = `https://api.twitter.com/2/users/${userId}/following`;
const bearerToken =
  "AAAAAAAAAAAAAAAAAAAAAEgfkAEAAAAA%2FodlzBdB9PDjf6AzhmL96z48RCQ%3DCJUEkmesuI7n26khHklAP8MzJ1TalghAZ6THKsrs9qpE26fQOY";

export async function getFollowing() {
  let users = [];
  let params = {
    max_results: 1000,
    "user.fields": "created_at",
  };

  const options = {
    headers: {
      "User-Agent": "v2FollowingJS",
      Authorization: `Bearer ${bearerToken}`,
      //expansions: "author_id",
    },
  };

  let hasNextPage = true;
  let nextToken = null;
  console.log("Retrieving users this user is following...");
  while (hasNextPage) {
    let resp = await getPage(params, options, nextToken);
    if (
      resp &&
      resp.meta &&
      resp.meta.result_count &&
      resp.meta.result_count > 0
    ) {
      if (resp.data) {
        users.push.apply(users, resp.data);
      }
      if (resp.meta.next_token) {
        nextToken = resp.meta.next_token;
      } else {
        hasNextPage = false;
      }
    } else {
      hasNextPage = false;
    }
  }

  //console.log(users);
  console.log(`Got ${users.length} users.`);
  return users;
};

const getPage = async (params, options, nextToken) => {
  if (nextToken) {
    params.pagination_token = nextToken;
  }

  try {
    const resp = await needle("get", url, params, options);

    if (resp.statusCode != 200) {
      console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
      return;
    }
    return resp.body;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
};

//getFollowing();

export default  getFollowing;