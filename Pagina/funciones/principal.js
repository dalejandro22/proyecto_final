let estado_filtrado = false;
let base_datos = "";

function obtenerDatos() {
    if (estado_filtrado === true) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="calificaciones"]:checked');
        const palabras_clave = document.getElementById('palabras_clave').value.toLowerCase();
        let calificaciones = [];

        checkboxes.forEach((checkbox) => {
            calificaciones.push(checkbox.nextElementSibling.innerHTML[0])
        });

        base_datos = database;

        database.forEach(objeto => {
            if (palabras_clave) {
                let incluido = 0;

                for (let key in objeto) {
                    if (objeto[key].toString().toLowerCase().includes(palabras_clave)) {
                        incluido = 1;
                        break
                    }
                }

                if (incluido === 0) {
                    base_datos = base_datos.filter(obj => obj.ID !== objeto.ID);
                }
            }

            if (calificaciones.length > 0) {
                if (!calificaciones.includes(objeto.CALIFICACION.toString())) {
                    base_datos = base_datos.filter(obj => obj.ID !== objeto.ID);
                }
            }
        });
    } else {
        base_datos = database;
    }
}

obtenerDatos();

function mostrarTabla(pagina) {
    const encabezado = ['NOMBRE', 'PAIS', 'CIUDAD', 'TELEFONO', 'CALIFICACION'];
    const botones = document.querySelector('.paginacion');
    const tbody = document.getElementById('tabla_cuerpo');
    botones.innerHTML = '';
    tbody.innerHTML = '';
    dato = 0;

    let inicio = (pagina - 1) * 10;
    let fin = inicio + 10;
    database_parcial = base_datos.slice(inicio, fin);

    let paginado = base_datos.length;

    for (let i = 1; i <= Math.ceil(paginado / 10); i++) {
        botones.innerHTML += '<button id="pagina_' + i + '" class="btn btn-light" onclick="mostrarTabla(' + i + ')"><b>' + i + '</b></button>'
    }

    let conteo = 1;
    database_parcial.forEach(objeto => {
        const fila = document.createElement('tr');
        fila.id = 'DB_' + objeto.ID;
        for (const atributo in objeto) {
            if (encabezado.includes(atributo)) {
                const td = document.createElement('td');
                td.textContent = objeto[atributo];
                fila.appendChild(td);
            }
        }
        const btn1 = document.createElement('td');
        btn1.innerHTML = '<button id="DET_' + objeto.ID + '" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#detalle_modal" onclick="transferir_detalles(id)">Detalles</button>';
        fila.appendChild(btn1);
        tbody.appendChild(fila);

        conteo++;
    });

    const caja_botones = document.querySelector('.paginacion').querySelectorAll('button');
    let id_actual = 'pagina_' + pagina;

    caja_botones.forEach(boton => {
        if (boton.id === id_actual) {
            document.getElementById(id_actual).classList.remove("btn-light");
            document.getElementById(id_actual).classList.add('btn-dark');
        } else {
            document.getElementById(boton.id).classList.remove('btn-dark');
            document.getElementById(boton.id).classList.add('btn-light');
        }
    });
}

mostrarTabla(1);

function filtrarTabla() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="calificaciones"]:checked');
    const palabras_clave = document.getElementById('palabras_clave').value.toLowerCase();

    if (checkboxes.length > 0 || palabras_clave) {
        estado_filtrado = true;
    } else {
        estado_filtrado = false;
    }

    obtenerDatos();
    mostrarTabla(1);
}

function limpiarFiltros() {
    estado_filtrado = false;

    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="calificaciones"]:checked');
    document.getElementById('palabras_clave').value = "";
    
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false
    });

    obtenerDatos();
    mostrarTabla(1);
}

limpiarFiltros();

function transferir_detalles(id) {
    let dato = database.filter(obj => obj.ID == id.replace('DET_', ''))[0];
    document.getElementById('titulo_detalle').innerHTML = 'Detalle de ' + dato.NOMBRE;

    cuerpo_detalle = document.getElementById('detalle_cuerpo');
    cuerpo_detalle.innerHTML = '';

    for (objeto in dato) {
        let div = document.createElement("div");
        div.classList.add('input-group');
        div.classList.add('mb-3');

        let span = document.createElement("span");
        span.classList.add('input-group-text');
        span.innerHTML = objeto;
        div.appendChild(span);

        let input = document.createElement("input");
        input.classList.add('form-control');
        input.type = 'text';
        input.setAttribute('value', dato[objeto]);
        input.setAttribute('id', 'DET_' + objeto);

        if (objeto == 'ID') {
            input.setAttribute('disabled', true);
        }
        
        div.appendChild(input);

        cuerpo_detalle.innerHTML += div.outerHTML;
    }
}

function editar() {
    const id = document.getElementById('DET_ID');
    const nombre_alt = document.getElementById('DET_NOMBRE');
    const direccion_alt = document.getElementById('DET_DIRECCION');
    const pais_alt = document.getElementById('DET_PAIS');
    const ciudad_alt = document.getElementById('DET_CIUDAD');
    const telefono_alt = document.getElementById('DET_TELEFONO');
    const email_alt = document.getElementById('DET_EMAIL');
    const web_alt = document.getElementById('DET_WEB');
    const calificacion_alt = document.getElementById('DET_CALIFICACION');
    const check_in_alt = document.getElementById('DET_CHECK_IN');
    const precio_noche_alt = document.getElementById('DET_PRECIO_NOCHE');

    for (let element in database) {
        if (element == id.value) {
            database[element - 1].NOMBRE = nombre_alt.value;
            database[element - 1].DIRECCION = direccion_alt.value;
            database[element - 1].PAIS = pais_alt.value;
            database[element - 1].CIUDAD = ciudad_alt.value;
            database[element - 1].TELEFONO = telefono_alt.value;
            database[element - 1].EMAIL = email_alt.value;
            database[element - 1].WEB = web_alt.value;
            database[element - 1].CALIFICACION = calificacion_alt.value;
            database[element - 1].CHECK_IN = check_in_alt.value;
            database[element - 1].PRECIO_NOCHE = precio_noche_alt.value;
        }
    }

    obtenerDatos();
    mostrarTabla(1);
}