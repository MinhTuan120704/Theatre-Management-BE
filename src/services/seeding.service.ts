import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import User from "../models/user.model";
import Cinema from "../models/cinema.model";
import Room from "../models/room.model";
import Seat from "../models/seat.model";
import Movie from "../models/movie.model";
import Product from "../models/product.model";
import ShowTime from "../models/showTime.model";
import Ticket from "../models/ticket.model";
import Order from "../models/order.model";
import OrderProductDetails from "../models/orderProductDetails.model";
import Review from "../models/review.model";
import RefreshToken from "../models/refreshToken.model";
import Employee from "../models/employee.model";
import Discount from "../models/discount.model";

export class SeedingService {
  static async seedUsers() {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const users = [
      {
        fullName: "Admin User",
        email: "admin@example.com",
        phone: "0123456789",
        passwordHash: hashedPassword,
        dob: new Date("1990-01-01"),
        identifyCode: "ADM001",
        role: "admin" as const,
      },
      {
        fullName: "Employee User",
        email: "employee@example.com",
        phone: "0123456790",
        passwordHash: hashedPassword,
        dob: new Date("1992-02-02"),
        identifyCode: "EMP001",
        role: "employee" as const,
      },
      {
        fullName: "Customer User",
        email: "customer@example.com",
        phone: "0123456791",
        passwordHash: hashedPassword,
        dob: new Date("1995-03-03"),
        identifyCode: "CUS001",
        role: "customer" as const,
      },
      {
        fullName: "Triệu Minh Tuấn",
        email: "22521615@gm.uit.edu.vn",
        phone: "0365819541",
        passwordHash: hashedPassword,
        dob: new Date("2004-03-02"),
        identifyCode: "066204010412",
        role: "customer" as const,
      },
    ];
    await User.bulkCreate(users);
  }

  static async seedCinemas() {
    const cinemas = [
      { name: "Lotte Dĩ An", address: "Nhà văn hóa sinh viên, Dĩ An" },
      { name: "Lotte Thủ Đức", address: "Q. Thủ Đức, TP.HCM" },
    ];
    await Cinema.bulkCreate(cinemas);
  }

  static async seedRooms() {
    const cinemas = await Cinema.findAll();
    const rooms = [];
    for (const cinema of cinemas) {
      rooms.push(
        { cinemaId: cinema.id, name: "Phòng 1", capacity: 50 },
        { cinemaId: cinema.id, name: "Phòng 2", capacity: 50 },
        { cinemaId: cinema.id, name: "Phòng 3", capacity: 50 }
      );
    }
    await Room.bulkCreate(rooms);
  }

  static async seedSeats() {
    const rooms = await Room.findAll();
    const seats = [];
    for (const room of rooms) {
      for (let row = 1; row <= 5; row++) {
        for (let col = 1; col <= 10; col++) {
          seats.push({
            roomId: room.id,
            seatNumber: `${String.fromCharCode(64 + row)}${col}`,
          });
        }
      }
    }
    await Seat.bulkCreate(seats);
  }

  // ...existing code...
  static async seedMovies() {
    const movies = [
      {
        title: "Avengers: Endgame",
        description:
          "Avengers: Endgame là bộ phim siêu anh hùng của Marvel Studios, nơi các siêu anh hùng phải đối mặt với kẻ thù mạnh mẽ nhất để cứu thế giới, với những cảnh hành động đỉnh cao và cảm xúc sâu sắc.",
        genres: ["Action", "Adventure"],
        director: "Anthony Russo",
        releaseDate: new Date("2020-04-26"),
        durationMinutes: 181,
        country: "USA",
        actors: ["Robert Downey Jr.", "Chris Evans"],
        posterUrl:
          "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
      },
      {
        title: "Inception",
        description:
          "Inception là một bộ phim khoa học viễn tưởng ly kỳ về việc xâm nhập vào giấc mơ để đánh cắp ý tưởng, với diễn biến phức tạp và những hiệu ứng thị giác ấn tượng.",
        genres: ["Sci-Fi", "Thriller"],
        director: "Christopher Nolan",
        releaseDate: new Date("2010-07-16"),
        durationMinutes: 148,
        country: "USA",
        actors: ["Leonardo DiCaprio", "Marion Cotillard"],
        posterUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXWnBnPN47nWvqWJAxw-vmchKc_2u1zkG6Bw&s",
        trailerUrl: "https://www.youtube.com/watch?v=8hP9D6kZseM",
      },
      {
        title: "The Shawshank Redemption",
        description:
          "The Shawshank Redemption là một bộ phim drama cảm động kể về cuộc sống trong tù của một người đàn ông vô tội, với thông điệp về hy vọng và tình bạn.",
        genres: ["Drama"],
        director: "Frank Darabont",
        releaseDate: new Date("1994-09-23"),
        durationMinutes: 142,
        country: "USA",
        actors: ["Tim Robbins", "Morgan Freeman"],
        posterUrl:
          "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=PLl99DlL6b4",
      },
      {
        title: "Mắt Biếc",
        description:
          "Mắt Biếc là bộ phim drama lãng mạn Việt Nam dựa trên tiểu thuyết cùng tên, kể về tình yêu tuổi học trò và những kỷ niệm đẹp đẽ của thanh xuân.",
        genres: ["Drama", "Romance"],
        director: "Victor Vũ",
        releaseDate: new Date("2019-12-27"),
        durationMinutes: 116,
        country: "Vietnam",
        actors: ["Trần Nghĩa", "Ngô Kiến Huy"],
        posterUrl:
          "https://upload.wikimedia.org/wikipedia/vi/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=ITlQ0oU7tDA&t=4s",
      },
      {
        title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
        description:
          "Tôi Thấy Hoa Vàng Trên Cỏ Xanh là bộ phim drama tuổi mới lớn Việt Nam, kể về hành trình trưởng thành của một cậu bé trong làng quê, với những xúc cảm trong sáng và sâu sắc.",
        genres: ["Drama"],
        director: "Victor Vũ",
        releaseDate: new Date("2015-04-17"),
        durationMinutes: 108,
        country: "VietNam",
        actors: ["Ngô Kiến Huy", "Trần Nghĩa"],
        posterUrl:
          "https://kenh14cdn.com/thumb_w/600/27fc8f4935/2015/09/09/TTHVTCX%20-%20Official%20poster-cd46e.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=wmjiCP6R-7I",
      },
      {
        title: "Cô Gái Đến Từ Hôm Qua",
        description:
          "Cô Gái Đến Từ Hôm Qua là bộ phim fantasy lãng mạn Việt Nam, kể về câu chuyện tình yêu kỳ ảo giữa một cô gái từ quá khứ và một chàng trai hiện đại.",
        genres: ["Fantasy", "Romance"],
        director: "Nguyễn Vinh Sơn",
        releaseDate: new Date("2017-10-27"),
        durationMinutes: 105,
        country: "Vietnam",
        actors: ["Chi Pu", "Nguyễn Trần Trung Anh"],
        posterUrl:
          "https://image-cdn.nct.vn/playlist/2017/07/17/0/a/a/b/1500294431471_500.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=1VcvcVgyuW4",
      },
      {
        title: "Oppenheimer",
        description:
          "Oppenheimer là bộ phim tiểu sử kịch tính kể về cuộc đời của nhà vật lý học J. Robert Oppenheimer, người đứng đầu dự án phát triển bom nguyên tử trong Thế chiến II, với những xung đột đạo đức và hậu quả to lớn.",
        genres: ["Biography", "Drama", "Thriller"],
        director: "Christopher Nolan",
        releaseDate: new Date("2026-01-21"),
        durationMinutes: 180,
        country: "USA",
        actors: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
        posterUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5q3kt5IarPpDNhyUU6PZKD3Ce2yeBW1rEEA&s",
        trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
      },
      {
        title: "Mai",
        description:
          "Mai là bộ phim hài hước và cảm động Việt Nam kể về cuộc sống của một người đàn ông tên Mai, với những tình huống dở khóc dở cười, khám phá các vấn đề gia đình và tình yêu, mang đến tiếng cười và suy ngẫm sâu sắc.",
        genres: ["Comedy", "Drama"],
        director: "Trấn Thành",
        releaseDate: new Date("2026-01-26"),
        durationMinutes: 120,
        country: "Vietnam",
        actors: ["Trấn Thành", "Hương Giang", "Ngọc Giàu"],
        posterUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGFaZKhw1JBkcZTEbzWzx0BzWU4N4qsf9PCw&s",
        trailerUrl: "https://www.youtube.com/watch?v=qZvIer97BGY",
      },
      {
        title: "Bộ tứ báo thủ",
        description:
          "Bộ Tư là bộ phim hài hước Việt Nam kể về cuộc sống của một nhóm bạn thân trong khu chung cư, với những tình huống vui nhộn, mâu thuẫn và hòa giải, nhấn mạnh giá trị của tình bạn và sự gắn kết.",
        genres: ["Comedy"],
        director: "Bảo Nhân",
        releaseDate: new Date("2024-04-05"),
        durationMinutes: 110,
        country: "Vietnam",
        actors: ["Bảo Nhân", "Ngọc Phước", "Hạnh Thúy"],
        posterUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkY0ayqfX-ZZwHgmgRdMUpe8b3UvczW2F5xg&s",
        trailerUrl: "https://www.youtube.com/watch?v=zKMOgOWn8lQ",
      },
    ];
    await Movie.bulkCreate(movies);
  }

  static async seedProducts() {
    const products = [
      {
        name: "Popcorn",
        price: 50000,
        category: "food" as const,
        image:
          "https://bhd.1cdn.vn/2023/07/16/files-library-newimages-20230716_baprangbo.jpg",
      },
      {
        name: "Pepsi",
        price: 40000,
        category: "drink" as const,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4sMBhgyZIK9bEih2WTSPekSY1PGs5JFfakw&s",
      },
      {
        name: "Sprite",
        price: 40000,
        category: "drink" as const,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo8lYrYzVCi4tHAnKg8YIYBxiubIKmMVvbVg&s",
      },
      {
        name: "Combo1",
        price: 80000,
        category: "food" as const,
        image:
          "https://starlight.vn/Areas/Admin/Content/Fileuploads/images/POSTER/7.jpg",
      },
    ];
    await Product.bulkCreate(products);
  }

  static async seedShowTimes() {
    const movies = await Movie.findAll({
      where: {
        releaseDate: {
          [Op.lte]: new Date(),
        },
      },
      order: [["id", "ASC"]],
      limit: 6,
    });
    const rooms = await Room.findAll();
    const showTimes = [];
    const now = new Date();
    for (let day = 1; day <= 7; day++) {
      const date = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
      for (const movie of movies) {
        for (const room of rooms) {
          showTimes.push({
            showTime: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              10,
              0,
              0
            ), // 10 AM
            price: 60000,
            movieId: movie.id,
            roomId: room.id,
          });
          showTimes.push({
            showTime: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              14,
              0,
              0
            ), // 2 PM
            price: 60000,
            movieId: movie.id,
            roomId: room.id,
          });
          showTimes.push({
            showTime: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              18,
              0,
              0
            ), // 6 PM
            price: 70000,
            movieId: movie.id,
            roomId: room.id,
          });
        }
      }
    }
    await ShowTime.bulkCreate(showTimes);
  }

  static async seedAll() {
    await this.seedUsers();
    await this.seedCinemas();
    await this.seedRooms();
    await this.seedSeats();
    await this.seedMovies();
    await this.seedProducts();
    await this.seedShowTimes();
  }

  static async clearAll() {
    await Ticket.destroy({ where: {} });
    await OrderProductDetails.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Review.destroy({ where: {} });
    await RefreshToken.destroy({ where: {} });
    await Employee.destroy({ where: {} });
    await Discount.destroy({ where: {} });
    await ShowTime.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Movie.destroy({ where: {} });
    await Seat.destroy({ where: {} });
    await Room.destroy({ where: {} });
    await Cinema.destroy({ where: {} });
    await User.destroy({ where: {} });
  }
}
