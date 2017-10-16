function requestUserInfo(userId){
    $.ajax({
      method: 'GET',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: `/api/getUserInfo/${userId}`,
//      success: (data) => {data},
      success: (data) =>{
          Object.assign(userData, data[0]);
      },

      error: (err) => {err},
      dataType: 'json',
      contentType: 'application/json'
    });
 }

const userData = {};