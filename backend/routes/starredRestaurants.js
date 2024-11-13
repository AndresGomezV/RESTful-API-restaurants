const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { restaurants } = require("./restaurants");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  //   Join the starred data with the all restaurants data to get the name of the starred restaurant.
  const starredRestaurant = STARRED_RESTAURANTS.find(
    (starredRestaurant) => starredRestaurant.id === id
  );

  // Find the restaurant in the list of restaurants. (Para usar su nombre en el result object)
  const restaurant = ALL_RESTAURANTS.find(
    (restaurant) => restaurant.id === starredRestaurant.restaurantId
  );
  // If the restaurant doesn’t exist, send a status code to the client to let it know the restaurant was not found.

  if (!starredRestaurant) {
    res.sendStatus(404);
    return;
  }

  // Otherwise, create an object with the starred restaurant’s id, comment, and name, and send the restaurant data to the front-end.
  const result = {
    id: starredRestaurant.id,
    comment: starredRestaurant.comment,
    name: restaurant ? restaurant.name : "Unknown",
  };

  res.json(result);
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  const { body } = req;
  /* extract the body property from the req (request) object. The body contains the data sent by the client in the request.*/
  const { id } = body;
  /*This id is expected to be part of the data sent by the client, representing the restaurant to be added to the starred list.*/

  // Find the restaurant in the list of starred restaurants.
  const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);

  // If the restaurant doesn’t exist, send a status code to the client to let it know the restaurant was not found.

  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  // Otherwise, proceed with adding a restaurant to your starred restaurants list:
  // Generate a unique id for the new starred restaurant.
  const newId = uuidv4();

  // Create a record for the new starred restaurant.
  const newStarredRestaurant = {
    id: newId,
    restaurantId: restaurant.id,
    comment: null, //comment initialized to null
  };
  // Push the new record into STARRED_RESTAURANTS.
  STARRED_RESTAURANTS.push(newStarredRestaurant);
  // Set a success status code and send the restaurant data to the front-end.
  res.status(200).send({
    id: newStarredRestaurant.id,
    comment: newStarredRestaurant.comment,
    name: restaurant.name,
    //restaurantId could be added if required
  });
});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  //   Use the .filter() method to remove this restaurant from your list of starred restaurants and save this list in a variable.
  const newStarredRestaurants = STARRED_RESTAURANTS.filter(
    (restaurant) => restaurant.id !== id
  );

  // If the restaurant doesn’t exist, send a status code to the client to let it know the restaurant was not found.
  if (STARRED_RESTAURANTS.length === newStarredRestaurants.length) {
    res.sendStatus(404);
    return;
  }

  // Otherwise, reassign STARRED_RESTAURANTS with the updated list of starred restaurants that you stored in a variable.
  STARRED_RESTAURANTS = newStarredRestaurants;

  res.sendStatus(200);
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { newComment } = req.body;
  // Find the restaurant in the list of starred restaurants.
  const restaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id) 

  // If the restaurant doesn’t exist, send a status code to the client to let it know the restaurant was not found.
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  // Otherwise, update the restaurant’s comment with the comment included in the request body.
restaurant.comment = newComment;

  // Send a success status code to the client.
  res.sendStatus(200);
});

module.exports = router;
