<?php
    $servername = "localhost";
    $database = "planeteg_db";
    $username = "planeteg_planeteg";
    $password = "Nesterenco87";
    
    $conn = new mysqli($servername, $username, $password, $database);
?>

<!DOCTYPE html>
<html xmlns="https://www.w3.org/1999/xhtml" lang="nl" xml:lang="nl">
<head>
    <meta http-equiv='content-type' content='text/html; charset=UTF-8'>
    <meta name="description" content="Planetegem">
    <meta name="keywords" content="keywords">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="googlebot" content="notranslate">
    <title>Planetegem</title>
    <link rel="stylesheet" href="style-list.css">
</head>
<body>
<segment id="list">
    <?php
    $sql = "SELECT * FROM pyarList ORDER BY id DESC";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo "id: " . $row["id"]. " - username: " . $row["username"]. " - prompt: " . $row["prompt"]. " - timestamp: " . $row["timestamp"] . "<br>"; 
        }
    } 
    $conn->close();
    ?>
</segment>
</body>