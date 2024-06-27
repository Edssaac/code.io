const URL_API = 'http://localhost/code.io.api';

const insertVideo = () => {
    const video = {
        title: $("#title").val(),
        description: $("#description").val(),
        videoid: $("#videoid").val()
    }

    ajaxInsertVideo(video);
}

const updateVideo = (id) => {
    ajaxRenderVideo(id, true);
}

const removeVideo = (id) => {
    if (confirm("Tem certeza que deseja excluir esse registro?")) {
        ajaxRemoveVideo(id);
    }
}

const renderVideo = (id) => {
    ajaxRenderVideo(id);
}

const renderVideos = () => {
    ajaxRenderVideos();
}

const createCards = (videos) => {
    const cardGroup = videos.map(video => `
        <div class="col">
            <div class="card h-100">
                <div class="card-header">${video.title}</div>
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
                            <button type="button" name="button" class="mb-2 w-100 btn btn-warning text-dark" onclick='updateVideo(${video.id})'>
                                <i class="far fa-edit"></i>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" name="button" class="mb-2 w-100 btn btn-success text-dark" onclick='renderVideo(${video.id})'>
                                <i class="far fa-eye"></i>
                            </button>
                        </div>
                        <div class="col">
                            <button type="button" name="button" class="mb-2 w-100 btn btn-danger text-dark" onclick='removeVideo(${video.id})'>
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`).join("");

    $("#cards").html(cardGroup);
}

const populateModal = (video, editable = false) => {
    $("#selectedVideoTitle").prop("disabled", !editable);
    $("#selectedVideoDescription").prop("disabled", !editable);
    $("#selectedVideoVideoID").prop("disabled", !editable);
    $(".editableContent").prop("hidden", !editable);

    if (!editable) {
        $("#modalVideoLabel").html(video.title);
    } else {
        $("#modalVideoLabel").html("");
        $("#selectedVideoTitle").val(video.title);
        $("#selectedVideoVideoID").val(video.videoid);
    }

    $("#selectedVideoDescription").val(video.description);
    $("#id").val(video.id);

    const iframe = `
        <div class="videoWrapper">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.videoid}"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
    `;

    $("#iframeVideo").html(iframe);
    $("#modalVideo").modal("show");
}

const ajaxInsertVideo = (video) => {
    $.ajax({
        url: `${URL_API}/video`,
        type: "POST",
        data: JSON.stringify(video),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (data) => {
            if (data.error) {
                const errorMessage = Array.isArray(data.error) ? data.error.join('<br>') : data.error;
                $("#modalVideoAlert").toggleClass("d-none", false).html(errorMessage);
                return;
            }

            $("#modalNewVideoAlert").toggleClass("d-none", true).html("");
            $("#modalNewVideo").modal("hide");
            $('#formNewVideo').trigger("reset");
            renderVideos();
        }
    });
}

const ajaxUpdateVideo = (id, video) => {
    $.ajax({
        url: `${URL_API}/video/${id}`,
        type: "PUT",
        data: JSON.stringify(video),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (data) => {
            if (data.error) {
                const errorMessage = Array.isArray(data.error) ? data.error.join('<br>') : data.error;
                $("#modalVideoAlert").toggleClass("d-none", false).html(errorMessage);
                return;
            }

            $("#modalVideoAlert").toggleClass("d-none", true).html("");
            $("#modalVideo").modal("hide");
            renderVideos();
        }
    });
}

const ajaxRemoveVideo = (id) => {
    $.ajax({
        url: `${URL_API}/video/${id}`,
        type: "DELETE",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (data) => {
            if (data.error) {
                alert("Não foi possível excluir este item.");
                return;
            }

            renderVideos();
        }
    });
}

const ajaxRenderVideo = (id, editable = false) => {
    $.ajax({
        url: `${URL_API}/video/${id}`,
        type: "GET",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (data) => {
            populateModal(data.video, editable);
        }
    });
}

const ajaxRenderVideos = () => {
    $.ajax({
        url: `${URL_API}/video`,
        type: "GET",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (data) => {
            console.log(data.videos)
            if (Array.isArray(data.videos) && data.videos.length > 0) {
                createCards(data.videos);
            } else {
                $("#cards").html("<div class='alert alert-warning text-center col-md-12' role='alert'>Nenhum conteúdo disponível.</div>");
            }
        }
    });
}

window.onload = renderVideos;

$("#modalVideo").on("hide.bs.modal", () => $("#iframeVideo").html(""));

$("#buttonAdd").on("click", insertVideo);

$("#formNewVideo").on("submit", () => false);

$("#buttonUpdate").on("click", () => {
    const id = $("#id").val();

    const video = {
        title: $("#selectedVideoTitle").val(),
        description: $("#selectedVideoDescription").val(),
        videoid: $("#selectedVideoVideoID").val()
    }

    ajaxUpdateVideo(id, video);
});

$("#frmVideo").on("submit", () => false);