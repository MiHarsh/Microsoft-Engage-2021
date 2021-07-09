import h from './helpers.js';

window.addEventListener( 'load', () => {

    const instantHost = document.getElementById('hostInstantMeet');
    instantHost.addEventListener('click',()=>{
        instantHost.setAttribute('href','/join?room=' + h.generateRandomString());
    });

    // when document is fully loaded
    $(document).ready(function() {
        $('.project-list').slick({
          dots: false,
          speed: 500,
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          touchThreshold: 300,
          responsive: [{
              // tablet
              breakpoint: 991,
              settings: {
                slidesToShow: 1
              }
            },
            {
              // mobile portrait
              breakpoint: 479,
              settings: {
                slidesToShow: 1
              }
            }
          ]
        });
        $('.slider-prev').click(function() {
          $("#slider-id").slick('slickPrev');
        });
        $('.slider-next').click(function() {
          $("#slider-id").slick('slickNext');
        });
      });



      const joinMeetModal = document.querySelector(".joinmeet-form-wrapper");
      const joinBtn = document.querySelector("#joinMeet-btn");
      const joinX = document.querySelector(".join-x");
      const formContainer = document.querySelector(".form-container");
      
      joinBtn.addEventListener("click", () => {
        joinMeetModal.classList.add("display");
        formContainer.classList.add("disable");
      });
  
      joinX.addEventListener("click", () => {
        joinMeetModal.classList.remove("display");
        formContainer.classList.remove("disable");
      });

});