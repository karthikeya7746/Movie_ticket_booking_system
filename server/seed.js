import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";
import Show from "./models/Show.js";

dotenv.config();

const movies = [
  {
    _id: "27205",
    title: "Inception",
    genres: ["Action", "Science Fiction"],
    runtime: 148,
    release_date: "2010-07-15",
    backdrop_path: "/gqby0RhyehP3uRrzmdyUZ0CgPPe.jpg",
    poster_path: "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    tagline: "Your mind is the scene of the crime.",
    vote_average: 8.4,
    overview:
      "A skilled thief is offered a chance to have his past crimes forgiven if he implants an idea into someone’s subconscious.",
  },
  {
    _id: "dune-2021",
    title: "Dune",
    genres: ["Science Fiction", "Adventure"],
    runtime: 155,
    release_date: "2021-09-15",
    backdrop_path: "duneBackdrop.png",
    poster_path: "dunePoster.png",
    tagline: "It begins.",
    vote_average: 7.8,
    overview:
      "Paul Atreides, a gifted young man, must travel to the most dangerous planet to secure his family’s future.",
  },
  {
    _id: "rrr",
    title: "RRR",
    genres: ["Action", "Drama"],
    runtime: 187,
    release_date: "2022-03-25",
    backdrop_path: "rrrBackdrop.png",
    poster_path: "rrrPoster.png",
    tagline: "Rise Roar Revolt",
    vote_average: 8.2,
    overview:
      "A tale of two legendary revolutionaries and their journey away from home.",
  },
  {
    _id: "game-changer",
    title: "Game Changer",
    genres: ["Action", "Drama"],
    runtime: 170,
    release_date: "2025-08-15",
    backdrop_path: "gamechangerBackdrop.png",
    poster_path: "gamechangerPoster.png",
    tagline: "The Political Storm Begins",
    vote_average: 7.2,
    overview: "A political thriller about the power struggle that shapes a nation.",
  },
  {
    _id: "devara",
    title: "Devara: Part 1",
    genres: ["Action", "Thriller"],
    runtime: 160,
    release_date: "2025-10-10",
    backdrop_path: "devaraBackdrop.png",
    poster_path: "devaraPoster.png",
    tagline: "Blood, Sea and Power",
    vote_average: 5.6,
    overview: "An epic story of power, revenge, and destiny set against the sea.",
  },
  {
    _id: "kgf",
    title: "KGF",
    genres: ["Action", "Drama"],
    runtime: 155,
    release_date: "2018-12-21",
    backdrop_path: "kgfBackdrop.png",
    poster_path: "kgfPoster.png",
    tagline: "From the Streets to the Gold Mines",
    vote_average: 8.3,
    overview:
      "The rise of Rocky, from poverty to power in the gold mines of Kolar.",
  },
  {
    _id: "pushpa",
    title: "Pushpa: The Rise",
    genres: ["Action", "Drama"],
    runtime: 179,
    release_date: "2021-12-17",
    backdrop_path: "pushpaBackdrop.png",
    poster_path: "pushpaPoster.png",
    tagline: "The Rule Begins",
    vote_average: 7.8,
    overview: "A red sandalwood smuggler rises through the ranks in the underworld.",
  },
  {
    _id: "salaar",
    title: "Salaar",
    genres: ["Action", "Thriller"],
    runtime: 175,
    release_date: "2023-12-22",
    backdrop_path: "salaarBackdrop.png",
    poster_path: "salaarPoster.png",
    tagline: "The Most Violent Men... Called One Man The Most Violent!",
    vote_average: 8.0,
    overview: "A tale of power, loyalty, and rebellion in a violent empire.",
  },
  {
    _id: "bahubali",
    title: "Baahubali: The Beginning",
    genres: ["Action", "Drama", "Fantasy"],
    runtime: 159,
    release_date: "2015-07-10",
    backdrop_path: "bahubaliBackdrop.png",
    poster_path: "bahubaliPoster.png",
    tagline: "The Beginning of a Legend",
    vote_average: 8.1,
    overview:
      "Shiva, a young man, discovers his past and his destiny tied to the Mahishmati kingdom.",
  },
  {
    _id: "bahubali2",
    title: "Baahubali 2: The Conclusion",
    genres: ["Action", "Drama", "Fantasy"],
    runtime: 171,
    release_date: "2017-04-28",
    backdrop_path: "bahubali2Backdrop.png",
    poster_path: "bahubali2Poster.png",
    tagline: "The Conclusion of a Saga",
    vote_average: 8.5,
    overview:
      "Mahendra Baahubali avenges his father's death and takes his rightful place as king.",
  },
  {
    _id: "arjun-reddy",
    title: "Arjun Reddy",
    genres: ["Drama", "Romance"],
    runtime: 186,
    release_date: "2017-08-25",
    backdrop_path: "arjunReddyBackdrop.png",
    poster_path: "arjunReddyPoster.png",
    tagline: "Intense. Raw. Real.",
    vote_average: 8.1,
    overview:
      "A brilliant surgeon struggles with anger management and heartbreak after losing his love.",
  },
  {
    _id: "mahanati",
    title: "Mahanati",
    genres: ["Drama", "Biography"],
    runtime: 177,
    release_date: "2018-05-09",
    backdrop_path: "mahanatiBackdrop.png",
    poster_path: "mahanatiPoster.png",
    tagline: "The Epic Story of Savitri",
    vote_average: 8.7,
    overview: "The life and struggles of the legendary actress Savitri.",
  },
];

const timings = ["10:00", "13:00", "16:00", "19:00"]; // 4 shows per day

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected...");

    await Movie.deleteMany({});
    await Show.deleteMany({});

    await Movie.insertMany(movies);

    const today = new Date();

    for (let movie of movies) {
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        for (let time of timings) {
          const [hours, minutes] = time.split(":");
          const showDateTime = new Date(date);
          showDateTime.setHours(parseInt(hours), parseInt(minutes));

          await Show.create({
            movie: movie._id,
            showDateTime,
            showPrice: 150,
            occupiedSeats: {},
          });
        }
      }
    }

    console.log("🎬 Seeding complete ✅");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
