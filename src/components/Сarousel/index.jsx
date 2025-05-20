import "./Carousel.scss";

import { Book } from "../Book";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

export const Carousel = ({ googleBooks }) => {
  const validBooks = Array.isArray(googleBooks)
    ? googleBooks.filter(book => book && book.title && book.imageLinks)
    : [];

  return (
    <>
      {validBooks.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={15}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {validBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <Book
                title={book.title}
                authors={book.authors}
                imageLinks={book.imageLinks}
                infoLink={book.infoLink}
                isbn13={book.isbn13}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
