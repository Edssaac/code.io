// ---------------------------------------------------------------------------------------

// Funções:
// Função responsável por criar um novo registro de vídeo:
function criarVideo() {

    var video = {
        titulo: $("#txtTitulo").val(),
        descricao: $("#txtDescricao").val(),
        videoid: $("#txtVideoId").val()
    }

    ajaxCriarVideo(video);
}

// Função responsável por editar um vídeo registrado:
function editarVideo(id) {
    ajaxVisualizarVideo(id, true);
}

// Função responsável por deletar um vídeo registrado:
function deletarVideo(id) {

    if (confirm("Tem certeza que deseja excluir esse registro?")) {
        ajaxDeletarVideo(id);
    }

}

// Função responsável por visualizar um vídeo em específico:
function visualizarVideo(id) {
    ajaxVisualizarVideo(id);
}

// Função responsável por visualizar todos os vídeos registrados:
function visualizarVideos() {
    ajaxVisualizarVideos();
}

// ---------------------------------------------------------------------------------------


// Função responsável por criar os cards:
function criarCards(videos) {

    var cardGroup = "";

    // Criando um card para cada vídeo cadastrado:
    for (var video of videos) {
        cardGroup += `<div class="col">
            <div class="card h-100">
                <div class="card-header">${video.titulo}</div>
                <div class="card-body">
                    <div class="videoWrapper">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.videoid}"
                            title="YouTube video player" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col">
                            <button type="button" name="button" class="mb-2 w-100 btn btn-warning text-dark" onclick='editarVideo(${video.id})'>
                                <i class="far fa-edit"></i> Editar
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" name="button" class="mb-2 w-100 btn btn-success text-dark" onclick='visualizarVideo(${video.id})'>
                                <i class="far fa-eye"></i> Aferir
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" name="button" class="mb-2 w-100 btn btn-danger text-dark" onclick='deletarVideo(${video.id})'>
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // Se não houverem conteúdos, então exibir mensagem:
    if (cardGroup == "") {
        $("#cards").html("<div class='alert alert-warning text-center col-md-12' role='alert'>Nenhum conteúdo disponível.</div>");
    } else {
        // Senão, apredentar os vídeos:
        $("#cards").html(cardGroup);
    }

}

// Função responsável por inserir as informações no modal de visualização/edição:
function popularModal(video, editar = false) {

    $("#txtTituloModalVideo").prop("disabled", !editar);
    $("#txtDescricaoModalVideo").prop("disabled", !editar);
    $("#txtVideoIdModalVideo").prop("disabled", !editar);

    $("#tituloGrupo").prop("hidden", !editar);
    $("#videoIdGrupo").prop("hidden", !editar);
    $("#btnAtualizar").prop("hidden", !editar);

    if (!editar) {
        $("#modalVideoLabel").html(video.titulo);
    } else {
        $("#modalVideoLabel").html("");
        $("#txtTituloModalVideo").val(video.titulo);
        $("#txtVideoIdModalVideo").val(video.videoid);
    }

    $("#txtDescricaoModalVideo").val(video.descricao);
    $("#id").val(video.id);

    var iframe =
        `<div class="videoWrapper">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.videoid}"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>`;

    $("#iframeVideo").html(iframe);
    $("#modalVideo").modal("show");
}

// ---------------------------------------------------------------------------------------

// Ajax:
// Função responsável por interagir com a api via ajax e criar um novo registro:
function ajaxCriarVideo(video) {
    $.ajax({
        url: "https://code-io-api.herokuapp.com/video/",
        type: "POST",
        data: video,
        dataType: "JSON",
        success: function (data) {
            // se tudo der certo:

            if (data.erro) {
                $("#modalNovoAlert").toggleClass("d-none", false);
                $("#modalNovoAlert").html(data.erro);

                return;
            }

            $("#modalNovoAlert").toggleClass("d-none", true);
            $("#modalNovoAlert").html("");
            visualizarVideos();
            $("#modalNovo").modal("hide");
            $('#frmNovo').trigger("reset");
        }
    });
}

// Função responsável por interagir com a api via ajax e editar um registrado específico:
function ajaxEditarVideo(id, video) {
    $.ajax({
        url: "https://code-io-api.herokuapp.com/video/" + id,
        type: "PUT",
        data: video,
        dataType: "JSON",
        success: function (data) {
            // se tudo der certo:

            if (data.erro) {
                $("#modalVideoAlert").toggleClass("d-none", false);
                $("#modalVideoAlert").html(data.erro);

                return;
            }

            $("#modalVideoAlert").toggleClass("d-none", true);
            $("#modalVideoAlert").html("");
            $("#modalVideo").modal("hide");
            visualizarVideos();
        }
    });
}

// Função responsável por interagir com a api via ajax e deletar um registrado:
function ajaxDeletarVideo(id) {
    $.ajax({
        url: "https://code-io-api.herokuapp.com/video/" + id,
        type: "DELETE",
        data: {},
        dataType: "JSON",
        success: function (data) {
            // se tudo der certo:

            if (data.erro) {
                alert("Não foi possível excluir este item.");

                return;
            }

            visualizarVideos();
        }
    });
}

// Função responsável por interagir com a api via ajax e obter um registro em específico:
function ajaxVisualizarVideo(id, editar = false) {
    $.ajax({
        url: "https://code-io-api.herokuapp.com/video/" + id,
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {
            // se tudo der certo:
            var video = data.resultado;
            popularModal(video, editar);
        }
    });
}

// Função responsável por interagir com a api via ajax e obter todos os registros:
function ajaxVisualizarVideos() {
    $.ajax({
        url: "https://code-io-api.herokuapp.com/video/",
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {
            // se tudo der certo:
            criarCards(data.resultado);
        }
    });
}

// ---------------------------------------------------------------------------------------

onload = () => {
    visualizarVideos();
}

$("#modalVideo").on("hide.bs.modal", function () {
    $("#iframeVideo").html("");
})

$("#btnAdicionar").on("click", function () {
    criarVideo();
});

$("#frmNovo").on("submit", function () {
    return false;
});

$("#btnAtualizar").on("click", function () {

    var id = $("#id").val();
    var video = {
        titulo: $("#txtTituloModalVideo").val(),
        descricao: $("#txtDescricaoModalVideo").val(),
        videoid: $("#txtVideoIdModalVideo").val()
    }

    ajaxEditarVideo(id, video);
});

$("#frmVideo").on("submit", function () {
    return false;
});