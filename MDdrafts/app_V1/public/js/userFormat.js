function requestUserInfo(userId){
    $.ajax({
      method: 'GET',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: `/api/getUserInfo/${userId}`,
//      success: (data) => {data},
      success: (data) =>{
          Object.setPrototypeOf(userData, data);
      },

      error: (err) => {err},
      dataType: 'json',
      contentType: 'application/json'
    });
 }

const userData = {};