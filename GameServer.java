// src/main/java/GameServer.java
import static spark.Spark.*;
import com.google.gson.Gson;

public class GameServer {

    // --- Game State ---
    private static int numberToGuess;
    private static int numberOfTries;

    // --- Response Object ---
    // A simple class to structure our JSON response to the frontend
    static class GameResponse {
        String message;
        int tries;
        boolean gameOver;

        GameResponse(String message, int tries, boolean gameOver) {
            this.message = message;
            this.tries = tries;
            this.gameOver = gameOver;
        }
    }

    // --- Game Logic ---
    private static void startNewGame() {
        numberToGuess = (int) (Math.random() * 100 + 1); // Random number 1-100
        numberOfTries = 0;
        // We print this to our own console for easy testing
        System.out.println("New game started. The secret number is: " + numberToGuess);
    }

    public static void main(String[] args) {
        // Start a new game when the server boots up
        startNewGame();
        Gson gson = new Gson();

        // Tell Spark to serve all frontend files from the 'public' folder
        staticFiles.location("/public");

        // --- API Endpoints ---

        // Endpoint for handling a user's guess. It expects a 'value' parameter.
        post("/guess", (req, res) -> {
            res.type("application/json"); // We will send a JSON response
            
            // This is the line that reads the guess from the URL
            int userGuess = Integer.parseInt(req.queryParams("value"));
            numberOfTries++;
            
            String message;
            boolean gameOver = false;

            // The core game logic. It sends simple, logical messages.
            if (userGuess < numberToGuess) {
                message = "Too low!";
            } else if (userGuess > numberToGuess) {
                message = "Too high!";
            } else {
                message = "Congratulations! You guessed it!";
                gameOver = true;
            }

            // Create a response object and convert it to a JSON string to send back
            return new GameResponse(message, numberOfTries, gameOver);
        }, gson::toJson);

        // Endpoint for restarting the game
        post("/restart", (req, res) -> {
            startNewGame();
            return "{\"message\":\"New game started\"}";
        });
    }
}