var bengkel = {
    dataAllFromId: ko.observableArray([]),
    dataawal: ko.observable("0"),
    dokumentanah: ko.observable("0"),
    NmBarangRow: ko.observable(""),
}

bengkel.prepareAll = function(){
    bengkel.ajaxGetDataBengkel();
    
}

bengkel.getDataFromId = function(id){
    $.ajax({
        dataType: "json",
        type: "post",
        url: "./controller/entry_asset/alatbengkel/select_all_from_id.php",
        data:{
            1: id
        }
    }).done(function(data){
        bengkel.dataAllFromId(data);
        fdu.tampungKodeLokasi(data.KodeLokasi)
    })
}

bengkel.cancel = function(){
    //Table Grid
    $("#table_aset_alatbengkel").show();
    $("#asetnavigasiexport").show();
    $("#DataTableAsetAlatBengkel").DataTable().ajax.reload();
    
    //Menu Navigasi
    $("#asetnavigasi").hide();

    //Reset Input Form Mutasi
    $('#mlokasitujuan').empty().append('<option selected></option>');
    $("#mkodelokasitujuan").val("");
    $("#mtahunperolehan").val("");
    $("#mketerangan").val("");
    // $('#DataTableSatuanKerja').DataTable().destroy();

    //Reset Input Form Penghapusan
    $("#htahunperolehan").val("");
    $("#hjenis").val("");
    $("#hketerangan").val("");

    //Form Edit
    $("#form_data_utama").hide();
    $("#form_aset_alatbengkel").hide();

    $("#form_mutasi").hide();
    $("#form_penghapusan").hide();
}

bengkel.ubahSimpan = function(id){
    var kodeabengkel    = id;
    var kodelokasi      = $("#fdu_kdlokasi").val();
    var kodebarang      = $("#fdu_kodebarang").val();

    var golalatbengkel    = $("#golonganalatbengkel").select2('data')[0].text;
    var nmalatbengkel     = $("#namabarangalatbengkel").val();
    var mrkalatbengkel    = $("#merkalatbengkel").val();
    var tpalatbengkel     = $("#tipealatbengkel").val();
    var bhnalatbengkel    = $("#bahanalatbengkel").val();
    var thperolehanalatbengkel    = $("#tahunperolehanalatbengkel").val();
    var ukalatbengkel     = $("#ukuranalatbengkel").val();
    var jmlalatbengkel    = $("#jumlahalatbengkel").val();
    var konalatbengkel    = $("#kondisialatbengkel").val();
    var asalusulalatbengkel       = $("#asalusulalatbengkel").select2('data')[0].text;
    var nilaiperolehan   = toAngka($("#nilaiperolehanalatbengkel").val());
    var keterangan       = $("#keteranganalatbengkel").val();

    var penanggungjawab     = $('#fdu_penanggungjawab').val();
    var lokasipjawab        = $("#fdu_lokasipenanggungjawab").val();
    var surveyor            = $('#fdu_surveyor').val();
    var tanggalsurvei       = $("#fdu_tanggalsurvei").data('datepicker').getFormattedDate('yyyy-mm-dd');
    var matauang            = $("#fdu_currency").val();
    var satuankerja         = $("#fdu_asetlokasi").select2('data')[0].text;
    var kodepemilik         = $("#fdu_kepemilikan").val();
    var noregister          = $("#fdu_noregister").val();
    var status              = "";
    var ketstatus           = "";
    var entry               = "";
    var entryuser           = $(".user_name").html();

    if(kodelokasi == "" || kodebarang == null){
        swal({
            title: "Tidak Diizinkan",
            text: "Mohon Periksa Kembali...",
            type: "error",
            confirmButtonText: "Ya"
        });
    }else{
        $.ajax({
            dataType: "json",
                type: "post",
                url: "./controller/pencarian_aset/alatbengkel/alatbengkel_ubah.php",
                data:{
                    kode: kodeabengkel, 1: kodebarang, 2: kodelokasi, 3: golalatbengkel, 4: nmalatbengkel, 
                    5: mrkalatbengkel, 6: tpalatbengkel, 7: bhnalatbengkel, 8: thperolehanalatbengkel, 
                    9: ukalatbengkel, 10: jmlalatbengkel, 11: konalatbengkel, 12: asalusulalatbengkel, 
                    13: nilaiperolehan, 14: keterangan, 15: penanggungjawab, 16: lokasipjawab, 17: surveyor, 
                    18: tanggalsurvei, 19: matauang, 20: satuankerja, 21: kodepemilik, 22: noregister, 23: entryuser 
            }
        }).done(function(data){
            // console.log("DATA TELAH BERHASIL DIINPUT")
            swal({
                title: "Berhasil Dirubah!",
                text: "Data Bengkel Berhasil Dirubah",
                type: "success",
                confirmButtonText: "Ya"
            });
            bengkel.cancel();
        });
    }
}

bengkel.ubah = function(n){
    // console.log("Masuk Ubah "+n);

    //Table Grid
    $("#modal-menu").modal('hide');
    $("#table_aset_alatbengkel").hide();
    $("#asetnavigasiexport").hide();

    //Menu Navigasi
    $("#asetnavigasi").show();

    //Form Edit
    $("#form_data_utama").show();
    $("#form_aset_alatbengkel").show();

    //Navigasi
    setTimeout(function(){
        $("#asetbatal").show();
        $("#asetsaveubah").show();
        $("#asetbatal").attr('onclick','bengkel.cancel()');
        $("#asetsaveubah").attr('onclick','bengkel.ubahSimpan("'+n+'")');
        $("#asetsavemutasi").hide();
        $("#asetsavepenghapusan").hide();
    });

    //Prepare Data Utama
        fdu.prepare();

        // Replace Data Barang
        $("#fdu_kodebarang").val(bengkel.dataAllFromId().KodeBarang);
        $.ajax({
            dataType: "json",
            type: "post",
            url: "controller/pencarian_aset/_datautama/select_namabarang.php",
            data:{
                1: bengkel.dataAllFromId().KodeBarang
            }
        }).done(function(data){
            $("#fdu_namabarang").val(data.NamaBarang)
        })

        // Replace Nama Kepemilikan
        $.ajax({
            dataType: "json",
            type: "post",
            url: "controller/pencarian_aset/_datautama/select_namapemilik.php",
            data:{
                1: bengkel.dataAllFromId().KodePemilik
            }
        }).done(function(data){
            $('#fdu_kepemilikan').empty().append('<option selected value='+bengkel.dataAllFromId().KodePemilik+'>'+data.NamaPemilik+'</option>');
        })

        //Replace Data Utama
        $("#fdu_penanggungjawab").val(bengkel.dataAllFromId().PenanggungJawab);
        $("#fdu_lokasipenanggungjawab").val(bengkel.dataAllFromId().LokasiPenanggungJawab);
        $("#fdu_noregister").val(bengkel.dataAllFromId().NoReg);
        // $("#fdu_currency").val(bengkel.dataAllFromId().MataUang);
        $('#fdu_currency').empty().append('<option selected value='+bengkel.dataAllFromId().MataUang+'>'+bengkel.dataAllFromId().MataUang+'</option>');

        //Replace Tanggal Survei
        var tanggalsur = bengkel.dataAllFromId().TglSurvey;
        var tanggalrepl = moment(tanggalsur).format('DD MMMM YYYY');

        var datepick = $("#fdu_tanggalsurvei input");
        datepick.datepicker({
                format: 'dd MM yyyy',
                language: 'id'
            });
        datepick.datepicker('setDate', tanggalrepl);
        
        //Replace Surveyor
        $("#fdu_surveyor").val(bengkel.dataAllFromId().Surveyor);

    //Replace Detail Bengkel======================================================

    //Replace Golongan Bengkel
    $('#golonganalatbengkel').select2({
        placeholder: 'Pilih Data Golongan...',
        minimumResultsForSearch: Infinity,
        ajax: {
            url: './controller/entry_asset/alatbengkel/select_golonganalatbengkel.php',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        }
    });
    setTimeout(function(){
        $('#golonganalatbengkel').empty().append('<option selected value='+bengkel.dataAllFromId().GolonganAlatBengkel+'>'+bengkel.dataAllFromId().GolonganAlatBengkel+'</option>');
    },500)

    //Replace Nama Alat Besar
    $("#namabarangalatbengkel").val(bengkel.dataAllFromId().NamaBarang);

    //Replace Tahun Perolehan dan Pembuatan
    $("#merkalatbengkel").val(bengkel.dataAllFromId().Merk);
    $("#tipealatbengkel").val(bengkel.dataAllFromId().Tipe);
    $("#bahanalatbengkel").val(bengkel.dataAllFromId().Bahan);
    $("#ukuranalatbengkel").val(bengkel.dataAllFromId().Ukuran);
    $("#jumlahalatbengkel").val(bengkel.dataAllFromId().Jumlah);

    $("#tahunperolehanalatbengkel").val(bengkel.dataAllFromId().TahunPerolehan);

    $("#kondisialatangkut").val(bengkel.dataAllFromId().Kondisi);

    //Replace Asal-Usul
    $('#asalusulalatbengkel').select2({
        placeholder: 'Pilih Asal Usul...',
        minimumResultsForSearch: Infinity,
        ajax: {
            url: './controller/entry_asset/alatbengkel/select_asalusul.php',
            dataType: 'json',
            delay: 250,
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        }
    });
    setTimeout(function(){
        $('#asalusulalatbengkel').empty().append('<option selected value='+bengkel.dataAllFromId().AsalUsul+'>'+bengkel.dataAllFromId().AsalUsul+'</option>');
    },500);

    //Replace Nilai Perolehan
    $('#nilaiperolehanalatbengkel').css("font-weight","bold");
    $('#nilaiperolehanalatbengkel').maskMoney({prefix:'', thousands:'.', decimal:',', precision:0});
    $("#nilaiperolehanalatbengkel").val(bengkel.dataAllFromId().NilaiPerolehan).trigger('mask.maskMoney');

    //Replace Keterangan
    $("#keteranganalatbengkel").val(bengkel.dataAllFromId().Keterangan);
}

bengkel.hapus = function(n){
    $("#modal-menu").modal('hide');
    // console.log("Masuk Hapus "+n)
    swal({
        title: "Data Akan Dihapus Permanen?",
        text: "Anda Akan Menghapus '"+n+"' Permanen!?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function (isConfirm) {
        // controller/pencarian_aset/_datautama/select_namapemilik.php
        if (isConfirm) {
            $.ajax({
                dataType: 'json',
                type:'post',
                url: 'controller/pencarian_aset/alatbengkel/alatbengkel_hapus.php',
                data:{kode: n}
            }).done(function(data){
                $("#DataTableAsetAlatBengkel").DataTable().ajax.reload();
                // swal("Berhasil Dihapus!", "Data Berhasil Dihapus", "success");
                swal({
                    title: "Berhasil Dihapus!",
                    text: "Data Berhasil Dihapus",
                    type: "success",
                    confirmButtonText: "Ya",
                })
            });
        } else {
            $("#DataTableAsetAlatBengkel").DataTable().ajax.reload();
            swal("Batal", "Data Batal Dihapus", "error");
        }
    });
}

bengkel.mutasi = function(n){
    // console.log("Masuk Mutasi "+n)

    //Table Grid
    $("#modal-menu").modal('hide');
    $("#table_aset_alatbengkel").hide();
    $("#asetnavigasiexport").hide();

    //Menu Navigasi
    $("#asetnavigasi").show();

    //Form Mutasi
    $("#form_mutasi").show();

    //Navigasi
    setTimeout(function(){
        $("#asetbatal").show();
        $("#asetsavemutasi").show();
        $("#asetbatal").attr('onclick','bengkel.cancel()');
        $("#asetsavemutasi").attr('onclick','bengkel.mutasiSimpan("'+n+'")');
        $("#asetsaveubah").hide();
        $("#asetsavepenghapusan").hide();

    });
    fm.prepare();

    //Replace Data Mutasi Lokasi Asal
    $.ajax({
        dataType: "json",
        type: "post",
        url: "controller/entry_asset/datautama/entry_asset_select_alllokasi.php",
        data:{
            1: bengkel.dataAllFromId().KodeLokasi
        }
    }).done(function(data){
        //Replace Lokasi Asal Name
        $("#mlokasiasal").val(data.SatuanKerja)
    })
    //Replace Kode Lokasi Asal
    $("#mkodelokasiasal").val(bengkel.dataAllFromId().KodeLokasi);

    //Get Nama Barang
    $.ajax({
        dataType: "json",
        type: "post",
        url: "controller/pencarian_aset/_datautama/select_namabarang.php",
        data:{
            1: bengkel.dataAllFromId().KodeBarang
        }
    }).done(function(data){
        //Replace Lokasi Asal Name
        bengkel.NmBarangRow(data.NamaBarang);

        //Replace Data Table Mutasi
        $('#tablemutasidetails > thead').empty();
        $('#tablemutasidetails > tbody').empty();
        $('#tablemutasidetails > thead').append('<tr style="background: #eee;"><th>Kode&nbsp;Alat</th><th>Kode&nbsp;Barang</th><th>Nama&nbsp;Barang</th><th>Jenis&nbsp;Alat&nbsp;Bengkel</th><th>Merk</th><th>Tipe</th><th>Bahan</th><th>Ukuran</th><th>Jumlah</th><th>Nilai</th><th>No.&nbsp;Reg.</th><th>Tahun&nbsp;Perolehan</th><th>Asal&nbsp;Usul</th><th>Kondisi</th></tr>');
        $('#tablemutasidetails > tbody').append('<tr><td>'+bengkel.dataAllFromId().KodeAlatBengkel+'</td><td>'+bengkel.dataAllFromId().KodeBarang+'</td><td>'+bengkel.NmBarangRow()+'</td><td>'+bengkel.dataAllFromId().GolonganAlatBengkel+'</td><td>'+bengkel.dataAllFromId().Merk+'</td><td>'+bengkel.dataAllFromId().Tipe+'</td><td>'+bengkel.dataAllFromId().Bahan+'</td><td>'+bengkel.dataAllFromId().Ukuran+'</td><td>'+bengkel.dataAllFromId().Jumlah+'</td><td>'+toRpp(bengkel.dataAllFromId().NilaiPerolehan)+'</td><td>'+bengkel.dataAllFromId().NoReg+'</td><td>'+bengkel.dataAllFromId().TahunPerolehan+'</td><td>'+bengkel.dataAllFromId().AsalUsul+'</td><td>'+kondisipersentase(bengkel.dataAllFromId().Kondisi)+'</td></tr>');
    
    })   
}

bengkel.mutasiSimpan = function(){
    var kodeabeng       = bengkel.dataAllFromId().KodeAlatBengkel;
    var kodelokasal     = $("#mkodelokasiasal").val();
    var kodeloktujuan   = $("#mkodelokasitujuan").val();
    var kodebarang      = bengkel.dataAllFromId().KodeBarang;
    var jumlah          = bengkel.dataAllFromId().Jumlah;
    var harga           = bengkel.dataAllFromId().NilaiPerolehan;
    var kodebidang      = bengkel.dataAllFromId().KodeBarang.substring(0,4);
    var kodepemilik     = bengkel.dataAllFromId().KodePemilik;
    var tahunmutasi     = $("#mtahunperolehan").val();
    var semester        = "1";
    var status          = "";
    var keterangan      = $("#mketerangan").val();

    if(kodeloktujuan == "" || tahunmutasi == ""){
        swal({
            title: "Tidak Diizinkan",
            text: "Mohon Periksa Kembali...",
            type: "error",
            confirmButtonText: "Ya"
        });
    }else{
        swal({
            title: "Data Akan Dimutasi?",
            text: "Anda Yakin Akan Melakukan Mutasi Terhadap '"+kodelokasal+"' ke '"+kodeloktujuan+"' !?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    dataType: "json",
                    type: "post",
                    url: "./controller/pencarian_aset/alatbengkel/alatbengkel_mutasi.php",
                    data:{
                        1: kodeabeng, 2: kodelokasal, 3: kodeloktujuan, 4: kodebarang, 
                        5: jumlah, 6: harga, 7: kodebidang, 8: kodepemilik, 9: tahunmutasi, 
                        10: semester, 11: status, 12: keterangan
                    }
                }).done(function(data){
                    // console.log("DATA TELAH BERHASIL DIINPUT")
                    swal({
                        title: "Berhasil Dimutasi!",
                        text: "Data Bengkel Berhasil Dimutasi",
                        type: "success",
                        confirmButtonText: "Ya"
                    });
                    bengkel.cancel();
                });
            }else{
                $("#DataTableAsetAlatBengkel").DataTable().ajax.reload();
                swal("Batal", "Data Batal Dimutasi", "error");
            }
            
        });
    }
}

bengkel.penghapusan = function(n){
    // console.log("Masuk Penghapusan "+n)
    //Table Grid
    $("#modal-menu").modal('hide');
    $("#table_aset_alatbengkel").hide();
    $("#asetnavigasiexport").hide();

    //Menu Navigasi
    $("#asetnavigasi").show();

    //Form Mutasi
    $("#form_penghapusan").show();

    //Navigasi
    setTimeout(function(){
        $("#asetbatal").show();
        $("#asetsavepenghapusan").show();
        $("#asetbatal").attr('onclick','bengkel.cancel()');
        $("#asetsavepenghapusan").attr('onclick','bengkel.penghapusanSimpan("'+n+'")');
        $("#asetsaveubah").hide();
        $("#asetsavemutasi").hide();
    });

    //Replace Data Penghapusan Lokasi Asal
    $.ajax({
        dataType: "json",
        type: "post",
        url: "controller/entry_asset/datautama/entry_asset_select_alllokasi.php",
        data:{
            1: bengkel.dataAllFromId().KodeLokasi
        }
    }).done(function(data){
        //Replace Lokasi Asal Name
        $("#hlokasiasal").val(data.SatuanKerja)
    })
    //Replace Kode Lokasi Asal
    $("#hkodelokasiasal").val(bengkel.dataAllFromId().KodeLokasi);

    //Get Nama Barang
    $.ajax({
        dataType: "json",
        type: "post",
        url: "controller/pencarian_aset/_datautama/select_namabarang.php",
        data:{
            1: bengkel.dataAllFromId().KodeBarang
        }
    }).done(function(data){
        //Replace Lokasi Asal Name
        bengkel.NmBarangRow(data.NamaBarang);

        //Replace Data Table Penghapusan
        $('#tablepenghapusandetails > thead').empty();
        $('#tablepenghapusandetails > tbody').empty();
        $('#tablepenghapusandetails > thead').append('<tr style="background: #eee;"><th>Kode&nbsp;Alat</th><th>Kode&nbsp;Barang</th><th>Nama&nbsp;Barang</th><th>Jenis&nbsp;Alat&nbsp;Bengkel</th><th>Merk</th><th>Tipe</th><th>Bahan</th><th>Ukuran</th><th>Jumlah</th><th>Nilai</th><th>No.&nbsp;Reg.</th><th>Tahun&nbsp;Perolehan</th><th>Asal&nbsp;Usul</th><th>Kondisi</th></tr>');
        $('#tablepenghapusandetails > tbody').append('<tr><td>'+bengkel.dataAllFromId().KodeAlatBengkel+'</td><td>'+bengkel.dataAllFromId().KodeBarang+'</td><td>'+bengkel.NmBarangRow()+'</td><td>'+bengkel.dataAllFromId().GolonganAlatBengkel+'</td><td>'+bengkel.dataAllFromId().Merk+'</td><td>'+bengkel.dataAllFromId().Tipe+'</td><td>'+bengkel.dataAllFromId().Bahan+'</td><td>'+bengkel.dataAllFromId().Ukuran+'</td><td>'+bengkel.dataAllFromId().Jumlah+'</td><td>'+toRpp(bengkel.dataAllFromId().NilaiPerolehan)+'</td><td>'+bengkel.dataAllFromId().NoReg+'</td><td>'+bengkel.dataAllFromId().TahunPerolehan+'</td><td>'+bengkel.dataAllFromId().AsalUsul+'</td><td>'+kondisipersentase(bengkel.dataAllFromId().Kondisi)+'</td></tr>');
    
    })  
}

bengkel.penghapusanSimpan = function(){
    var kode            = bengkel.dataAllFromId().KodeAlatBengkel;
    var kodelokasal     = $("#hkodelokasiasal").val();
    var kodebarang      = bengkel.dataAllFromId().KodeBarang;
    var jumlah          = bengkel.dataAllFromId().Jumlah;
    var harga           = bengkel.dataAllFromId().NilaiPerolehan;
    var kodebidang      = bengkel.dataAllFromId().KodeBarang.substring(0,4);
    var kodepemilik     = bengkel.dataAllFromId().KodePemilik;
    var tahunpenghapusan= $("#htahunperolehan").val();
    var jenispenghapusan= $("#hjenis").val();
    var semester        = "1";
    var status          = "";
    var keterangan      = $("#hketerangan").val();
    if(tahunpenghapusan == "" || jenispenghapusan == ""){
        swal({
            title: "Tidak Diizinkan",
            text: "Mohon Periksa Kembali...",
            type: "error",
            confirmButtonText: "Ya"
        });
    }else{
        swal({
            title: "Data Akan Dihapuskan?",
            text: "Anda Yakin Akan Melakukan Penghapusan Terhadap '"+kodelokasal+"' !?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    dataType: "json",
                    type: "post",
                    url: "./controller/pencarian_aset/alatbengkel/alatbengkel_penghapusan.php",
                    data:{
                        1: kode, 2: kodelokasal, 3: jenispenghapusan, 4: kodebarang, 
                        5: jumlah, 6: harga, 7: kodebidang, 8: kodepemilik, 9: tahunpenghapusan, 
                        10: semester, 11: status, 12: keterangan
                    }
                }).done(function(data){
                    // console.log("DATA TELAH BERHASIL DIINPUT")
                    swal({
                        title: "Berhasil Dilakukan Penghapusan!",
                        text: "Data Jalan Berhasil Dilakukan Penghapusan",
                        type: "success",
                        confirmButtonText: "Ya"
                    });
                    bengkel.cancel();
                }); 
            }else{
                $("#DataTableAsetAlatBengkel").DataTable().ajax.reload();
                swal("Batal", "Data Batal Dihapus", "error");
            }
            
        });
    }
}

bengkel.ajaxGetDataBengkel = function(){
    var lv = $(".user_level").text();
    var loc = $(".user_location").text();
    var dataTableTanah = $("#DataTableAsetAlatBengkel").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax":{
            url: "./controller/pencarian_aset/alatbengkel/alatbengkel_controller.php",
            type: "post",
            data:{
                level: lv, location: loc
            },
            error: function() {
                $(".DataTableAsetAlatBengkel-error").html("");
                $("#DataTableAsetAlatBengkel").append('<tbody class="DataTableAsetAlatBengkel-grid-error"><tr><th colspan="8">Data Tidak Ditemukan...</th></tr></tbody>');
                $("#DataTableAsetAlatBengkel_processing").css("display","none");
            },
            complete: function() {
            }
        },
        "order": [[ 0, 'asc' ]],
        "sScrollY": 400, //height
        "sScrollX": "100%",
        "columnDefs": [ 
            // { 
            //     targets: [9],
            //     "render" : function( data, type, full ) {
            //         // you could prepend a dollar sign before returning, or do it
            //         // in the formatNumber method itself
            //         return formatNumber(data);  
            //     }
            // },
            // { 
            //     targets: [10],
            //     "render" : function( data, type, full ) {
            //         // you could prepend a dollar sign before returning, or do it
            //         // in the formatNumber method itself
            //         return formatNumber(data);  
            //     }
            // },
            { 
                targets: [12],
                "render" : function( data, type, full ) {
                    // you could prepend a dollar sign before returning, or do it
                    // in the formatNumber method itself
                    return kondisipersentase(data); 
                }
            },
            { 
                targets: [14],
                
                "className": "text-right",
                
                "render" : function( data, type, full ) {
                    // you could prepend a dollar sign before returning, or do it
                    // in the formatNumber method itself
                    return formatNumber(data);  
                }
            }
        ],
        lengthMenu: [
            [ 10, 25, 50, 100, 500, 1000, 5000, 10000],
            [ '10 rows', '25 rows', '50 rows', '100 rows', '500 rows', '1K rows', '5K rows', '10K rows' ]
        ],
        // "dom": 'Blfrtip',
        // "buttons": ['excel'],
        // initComplete: function () {
        //     $('.buttons-pdf').html('<span class="glyphicon glyphicon-file" data-toggle="tooltip" title="Export To Excel"/>')
        // }
    });  
    bengkel.clickRow();

    //Custom Button for export data
    var dt = $('#DataTableAsetAlatBengkel' ).DataTable();
    // Name of the filename when exported (except for extension
    var export_filename = 'DataAsetAlatBengkel-'+moment().format("DD-MM-YYYY");
    // Configure Export Buttons
    new $.fn.dataTable.Buttons( dt, {
        buttons: [
            {
                text: '<i class="fa fa-lg fa-clipboard"></i> Copy Data',
                extend: 'copy',
                className: 'btn btn-default p-5 m-0 width-35 assets-export-btn export-copy ttip'
            }, {
                text: '<i class="fa fa-lg fa-file-excel-o"></i> Export Excel',
                extend: 'excel',
                className: 'btn btn-default p-5 m-0 width-35 assets-export-btn export-xls ttip',
                title: export_filename,
                extension: '.xls'
            }
        ]
    } );
     
    // Add the Export buttons to the toolbox
    dt.buttons( 0, null ).container().appendTo( '#asetnavigasiexport .text-left' );
}

bengkel.clickRow = function(){
    var table = $('#DataTableAsetAlatBengkel').DataTable();
    $('#DataTableAsetAlatBengkel tbody').on( 'click', 'tr', function () {
        // console.log( table.row( this ).data() );

        var data=[];
        data=table.row( this ).data();
        // console.log(data)

        if(data != undefined){
            $("#modal-menu").modal('show'); 
            // alert(avals);
            $("li.ubah").attr('onclick','bengkel.ubah("'+data[0]+'")');
            $("li.hapus").attr('onclick','bengkel.hapus("'+data[0]+'")');
            $("li.mutasi").attr('onclick','bengkel.mutasi("'+data[0]+'")');
            $("li.penghapusan").attr('onclick','bengkel.penghapusan("'+data[0]+'")');
            bengkel.getDataFromId(data[0])
        }
    });
}

function formatNumber(n) {
  return n.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}

$(document).ready(function () {
    bengkel.prepareAll();
});
