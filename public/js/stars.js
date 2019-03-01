$(document).ready(function(){
  
    
    $('#stars li').on('mouseover', function(){
      var onStar = parseInt($(this).data('value'), 10); 
     
      $(this).parent().children('li.star').each(function(e){
        if (e < onStar) {
          $(this).addClass('hover');
        }
        else {
          $(this).removeClass('hover');
        }
      });
      
    }).on('mouseout', function(){
      $(this).parent().children('li.star').each(function(e){
        $(this).removeClass('hover');
      });
    });
    
    

    $('.seleccion li').on('click', function(){
      var onStar = parseInt($(this).data('value'), 10); 
      var stars = $(this).parent().children('li.star');
      var video = $(this).attr('id');
      console.log('este es el id del video: ' + video)
      
      for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }
      
      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
      }

      for (i = 0; i < onStar; i++) {
        var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
      var msg = "";
      if (ratingValue === 1) {
        msg = "vota " + ratingValue + " estrella";
      } else{
        msg = "vota " + ratingValue + " estrellas";
      }
        $(stars[i]).parent().parent().html(`<button class="btn btn-outline-primary votoEstrella" type = "submit" action="" id ="${ratingValue}">${msg}</button><input type="hidden" id="custId" name="stars" value="${ratingValue}"><input type="hidden" id="custId" name="film_id" value="${video}">`).addClass('selected');

      }
      
    
      
    
      
    });
    
    
  });
  /*
  $('.votoEstrella').on('click', function(){
    $(this).removeClass('btn-outline-primary').addClass('btn-secondary');
   });

  function addMessageVote() {
    setTimeout(function(){ alert(`Ya le has dado ${ratingValue} a este video`) }, 1000);
  }*/