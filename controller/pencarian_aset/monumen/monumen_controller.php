<?php

require ('../../../engine/db_config.php');
// storing  request (ie, get/post) global array to a variable  
$requestData= $_REQUEST;
$_level     = $requestData["level"];
$_location  = $requestData["location"];

if($_level == "Admin"){
    $dw1 ='';
    $dw2a ='';
    $dw2b ='';
    $dw3 ='';
}else{
    $tkdlok     = $_location;
    $tkdlokflat = rtrim($tkdlok, "0"); 
    $sqllok = "SELECT KodeLokasi FROM masterlokasi WHERE KodeLokasi LIKE '%{$tkdlokflat}%'"; 
    $resultlok = $mysqli->query($sqllok);
    $loknum = $mysqli->affected_rows;
    // echo $loknum;
    if( $loknum > 0)
    {
        $dtlok_arr = array();
        while ( $row = mysqli_fetch_array($resultlok) )
            $dtlok_arr[] = $row[0];
        if( count($dtlok_arr) > 0){
            $data_arr_location = implode(',', $dtlok_arr);
        }else{
            echo 'No number is there';
        }
    }

    $dw1 = 'WHERE KodeLokasi IN('.$data_arr_location.')';
    $dw2a = 'KodeLokasi IN('.$data_arr_location.') AND';
    $dw2b = 'AND KodeLokasi IN('.$data_arr_location.')';
    $dw3 = 'WHERE KodeLokasi IN('.$data_arr_location.')';
}


include '../../../engine/configdb_for_ajax_datatable.php';
$columns = array( 
// datatable column index  => database column name
    0 => 'KodeMonumen', 
    1 => 'SubUnit',
    2 => 'SatuanKerja',
    3 => 'NamaPemilik', 
    4 => 'GolonganMonumen', 
    5 => 'NamaMonumen', 
    6 => 'Letak',
    7 => 'Konstruksi',
    8 => 'LuasTanah',
    9 => 'LuasBangunan',
    10 => 'Tingkat',
    11 => 'TanggalDokumen',
    12 => 'TahunPerolehan', 
    13 => 'Kondisi',  
    14 => 'AsalUsul',
    15 => 'NilaiPerolehan', 
    16 => 'Keterangan', 
    17 => 'PenanggungJawab', 
    18 => 'EntryUser'  
);




// getting total number records without any search
$sql = "SELECT KodeMonumen, KodeLokasi, SubUnit, SatuanKerja, NamaPemilik, GolonganMonumen, NamaMonumen, Letak, Konstruksi, LuasTanah, LuasBangunan, Tingkat, TanggalDokumen, TahunPerolehan, Kondisi, AsalUsul, NilaiPerolehan, Keterangan, PenanggungJawab, EntryUser, Status";
$sql.=" FROM aset_monumen {$dw1}";


$query=mysqli_query($conn, $sql) or die("monumen_controller: Get Data Monumen");
$totalData = mysqli_num_rows($query);
$totalFiltered = $totalData;  // when there is no search parameter then total number rows = total number filtered rows.



if( !empty($requestData['search']['value']) ) {
    // if there is a search parameter
    $sql = "SELECT KodeMonumen, KodeLokasi, SubUnit, SatuanKerja, NamaPemilik, GolonganMonumen, NamaMonumen, Letak, Konstruksi, LuasTanah, LuasBangunan, Tingkat, TanggalDokumen, TahunPerolehan, Kondisi, AsalUsul, NilaiPerolehan, Keterangan, PenanggungJawab, EntryUser, Status";
    $sql.=" FROM aset_monumen WHERE {$dw2a}";
    $sql.=" KodeMonumen LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  SubUnit LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  SatuanKerja LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  NamaPemilik LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  GolonganMonumen LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  NamaMonumen LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  Letak LIKE '%".$requestData['search']['value']."%' {$dw2b}";

    $sql.=" OR  Konstruksi LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  LuasTanah LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  LuasBangunan LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  Tingkat LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    
    $sql.=" OR  TanggalDokumen LIKE '%".$requestData['search']['value']."%' {$dw2b}";

    $sql.=" OR  TahunPerolehan LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  Kondisi LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  AsalUsul LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  NilaiPerolehan LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  Keterangan LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  PenanggungJawab LIKE '%".$requestData['search']['value']."%' {$dw2b}";
    $sql.=" OR  EntryUser LIKE '%".$requestData['search']['value']."%' {$dw2b}";

    

    $query=mysqli_query($conn, $sql) or die("monumen_controller: Get Aset Monumen from Search 1");
    $totalFiltered = mysqli_num_rows($query); // when there is a search parameter then we have to modify total number filtered rows as per search result without limit in the query 

    $sql.=" ORDER BY ". $columns[$requestData['order'][0]['column']]."   ".$requestData['order'][0]['dir']." LIMIT ".$requestData['start']." ,".$requestData['length']."   "; // $requestData['order'][0]['column'] contains colmun index, $requestData['order'][0]['dir'] contains order such as asc/desc , $requestData['start'] contains start row number ,$requestData['length'] contains limit length.
    $query=mysqli_query($conn, $sql) or die("monumen_controller: Get Monumen from Search 2"); // again run query with limit
    // $num_rows = mysql_num_rows($query);
    
} else {    
    $sql = "SELECT KodeMonumen, KodeLokasi, SubUnit, SatuanKerja, NamaPemilik, GolonganMonumen, NamaMonumen, Letak, Konstruksi, LuasTanah, LuasBangunan, Tingkat, TanggalDokumen, TahunPerolehan, Kondisi, AsalUsul, NilaiPerolehan, Keterangan, PenanggungJawab, EntryUser, Status";
    $sql.=" FROM aset_monumen {$dw3}";
    $sql.=" ORDER BY ". $columns[$requestData['order'][0]['column']]."   ".$requestData['order'][0]['dir']."   LIMIT ".$requestData['start']." ,".$requestData['length']."   ";
    $query=mysqli_query($conn, $sql) or die("monumen_controller: Get Aset Monumen from Search false");
    // $num_rows = mysql_num_rows($query);
}


$data = array();
// for(i=1; i<=$totalFiltered; i++;)
while( $row=mysqli_fetch_array($query)) {  // preparing an array
    $nestedData=array();
    $nestedData[] = $row["KodeMonumen"]; 
    $nestedData[] = $row["SubUnit"];
    $nestedData[] = $row["SatuanKerja"];
    $nestedData[] = $row["NamaPemilik"]; 
    $nestedData[] = $row["GolonganMonumen"]; 
    $nestedData[] = $row["NamaMonumen"]; 
    $nestedData[] = $row["Letak"];
    $nestedData[] = $row["Konstruksi"];
    $nestedData[] = $row["LuasTanah"];
    $nestedData[] = $row["LuasBangunan"];
    $nestedData[] = $row["Tingkat"];
    $nestedData[] = date('d-m-Y',strtotime($row["TanggalDokumen"]));
    $nestedData[] = $row["TahunPerolehan"]; 
    $nestedData[] = $row["Kondisi"];  
    $nestedData[] = $row["AsalUsul"];
    $nestedData[] = $row["NilaiPerolehan"]; 
    $nestedData[] = $row["Keterangan"]; 
    $nestedData[] = $row["PenanggungJawab"]; 
    $nestedData[] = $row["EntryUser"];  
    $data[] = $nestedData;
}

$json_data = array(
            "draw"            => intval( $requestData['draw'] ),   // for every request/draw by clientside , they send a number as a parameter, when they recieve a response/data they first check the draw number, so we are sending same number in draw. 
            "recordsTotal"    => intval( $totalData ),  // total number of records
            "recordsFiltered" => intval( $totalFiltered ), // total number of records after searching, if there is no searching then totalFiltered = totalData
            "data"            => $data   // total data array
            );

// for creat a number

echo json_encode($json_data);  // send data as json format

?>
