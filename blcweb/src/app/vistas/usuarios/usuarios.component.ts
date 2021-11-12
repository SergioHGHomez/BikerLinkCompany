import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const URLHost = "http://localhost:8082"
    let usersList: any;

    $("#mensajeNav").html("Conectado a medellin")
    UpdateList()

    
    //----------------- funciones --------------------
    $("#btn_crearU").on("click",() => {
      
      let document = $("#inp_documentNew").val();
      let name = $("#inp_nameNew").val();
      let email = $("#inp_emailNew").val();
      let user = $("#inp_userNew").val();
      let password = $("#inp_passwordNew").val();
      
    
      saveUsuer(document, name, email, user, password);
    })

    $("#btn_buscar").on("click",() => {
      let document = $("#inp_document").val();
      if (document != '') {
        searchUser(document);
      }
      
    })
    
    $("#btn_eliminar").on("click",() => {
      let document = $("#inp_document").val();
      deleteUser(document);
    })

    $("#btn_editar").on("click",() => {
      let document = $("#inp_document").val();
      let name = $("#inp_name").val();
      let email = $("#inp_email").val();
      let user = $("#inp_user").val();
      let password = $("#inp_password").val();

      updateUsuer(document, name, email,user, password)

    })
    //----------- actualiza el listado de usuarios  -------
    function UpdateList(){
      getUsers().then((data) => {
        usersList = data
    } );
    }

    // -------- eliminar estudiantes -----------------------------
    function deleteUser(document: any){
     return new Promise(() => {
      let idUser = -1
      let nameUser: any

      for(var i = 0; i < usersList.length; i++) {
          
        if(usersList[i].cedula_usuario == document) {
          nameUser = usersList[i].nombre_usuario
          idUser = usersList[i]._id
            break      
        }
      }

      fetch(URLHost + "/api/usuarios/eliminar/" + idUser, {
        method: 'DELETE',
      }).then(() => {
        getUsers()
        let message = '<div class="alert alert-warning alert-dismissible fade show" role="alert">'+
        '<strong>Se ha eliminado!</strong>'+
        'El usuario '+nameUser+ // aqui esta el mensaje
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
      '</div>'
        $("#Form_user").html(message)
      })

     });
    }

    //------------------ buscar usuario -----------------------------
    
    function searchUser(document: any) {
        for(var i = 0; i < usersList.length; i++) {
          
          if(usersList[i].cedula_usuario == document) {
              console.log(usersList[i].cedula_usuario)
              console.log(usersList[i].nombre_usuario)
              let result = '<label for="recipient-name" class="col-form-label">nombre</label>'+
              '<input id="inp_name" type="text" class="form-control" value="'+ usersList[i].nombre_usuario +'">'+
              '<label for="recipient-name" class="col-form-label">email</label>'+
              '<input id="inp_email" type="text" class="form-control" value="'+ usersList[i].email_usuario +'">'+
              '<label for="recipient-name" class="col-form-label">usuario</label>'+
              '<input id="inp_user" type="text" class="form-control" value="'+ usersList[i].usuario +'">'+
              '<label for="recipient-name" class="col-form-label">password</label>'+
              '<input id="inp_password" type="text" class="form-control" value="'+ usersList[i].password +'">'
              
              $("#Form_user").html(result)
              
              break
              
          }
        }
        
    }

//------------------- guardar usuario -------------------------------
    function saveUsuer(newDocument: any , newName: any, newEmail: any, newUser: any, newPassword: any){
      return new Promise<void>(() => {

        fetch(URLHost + "/api/usuarios/guardar/", {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'}, 
          body: JSON.stringify({
          "cedula_usuario":String(newDocument),
          "nombre_usuario": String(newName),
          "email_usuario":String(newEmail),
          "usuario":String(newUser),
          "password":String(newPassword)})
        }).then(() => {
          UpdateList()
        })

      })
    }
    //------------------- actualizar usuario ------------------------
    function updateUsuer(document: any , newName: any, newEmail: any, newUser: any, newPassword: any){
      return new Promise<void>(() => {

        let idUser = -1

      for(var i = 0; i < usersList.length; i++) {
          
        if(usersList[i].cedula_usuario == document) {
          idUser = usersList[i]._id
            break      
        }
      }

        fetch(URLHost + "/api/usuarios/actualizar/" + idUser, {
          method: 'PUT',
          headers: {
            'Content-Type':'application/json'}, 
          body: JSON.stringify({
          "nombre_usuario": String(newName),
          "email_usuario":String(newEmail),
          "usuario":String(newUser),
          "password":String(newPassword)})
        }).then(() => {
          UpdateList()
          let message = '<div class="alert alert-warning alert-dismissible fade show" role="alert">'+
        '<strong>Se ha actualizado el Usuario</strong>'+
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
      '</div>'
        $("#Form_user").html(message)
        })

      })
    }
    //-------------------- traer el listado de usuarios --------------------
    /**
     * trae el listado de usuarios de la base de datos y los muestra en la pagina como una tabla 
     * @returns lista de usuarios 
     */
    function getUsers() {
      return new Promise((resolve, reject) => {

        fetch(URLHost + "/api/usuarios/listar", {
          method: 'GET',
        }).then(result => result.json().then(
          data => {
            JSON.stringify(data)
            resolve(data);
            let salida = '<table class="table">';
            salida = salida + '<tr> <thead> <th scope="col">#</th>'+
            '<th scope="col">cedula</th>'+
            '<th scope="col">NOMBRE</th>'+
            '<th scope="col">CORREO</th>'+
            '<th scope="col">USUARIO</th>'+
            '<th scope="col">CONTRASEÑA</th>'+
            '</thead><tbody>';

            for (var iterator in data) {
              console.log(data[iterator].usuario)
              salida = salida + '<tr><th scope="row">'+iterator+'</th>';
              salida = salida + '<td>' + data[iterator].cedula_usuario + '</td>';
              salida = salida + '<td>' + data[iterator].nombre_usuario + '</td>';
              salida = salida + '<td>' + data[iterator].email_usuario + '</td>';
              salida = salida + '<td>' + data[iterator].usuario + '</td>';
              salida = salida + '<td>' + data[iterator].password + '</td>';
              salida = salida + '</tr>';
              
            }
            salida = salida + "<tbody></table>";
				    $("#tbUsers").html(salida);
          }
        ));

      });
    }
  }


}
