<?php    
    if (array_key_exists("page", $_GET)){
        $currentPage = $_GET["page"];
    } else {
        $currentPage = 1;
    }
    
    $sql = "SELECT COUNT(*) AS ROW_COUNT FROM pyarList";
    $result = $conn->query($sql);
    $totalRecords = $result->fetch_assoc()["ROW_COUNT"];

    $maxImages = 12;
    $offset = ($currentPage - 1)*$maxImages;
    $limit = $currentPage*$maxImages;
    
    $maxPages = floor($totalRecords / $maxImages) + 1;
?>

<!DOCTYPE html>
<html xmlns="https://www.w3.org/1999/xhtml" lang="nl" xml:lang="nl">
<head>
    <meta http-equiv='content-type' content='text/html; charset=UTF-8'>
    <meta name="description" content="Pyar Database">
    <meta name="keywords" content="keywords">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="googlebot" content="notranslate">
    <title>Pyar database</title>
    <link rel="stylesheet" href="style-list.css">
</head>
<body>
<main>
    <segment id="list">
    <?php
    include "connection.php";
    $conn = new mysqli($servername, $username, $password, $database);
    
    $sql = "SELECT * FROM pyarList ORDER BY id DESC LIMIT " . $offset . ", " . $limit;
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo '<div class="artwork">';
            
            $tempusername = str_replace(" ", "_", $row["username"]);
            $filename = "output/" . $row["prompt"] . "_by_" . $tempusername . ".png";
            echo '<img src="' . $filename . '">';
            
            $prompt = str_replace("_", " ", $row["prompt"]);
            echo '<h2>' . $prompt . '</h2>';
            
            echo '<p>generated by ' . $row["username"] . '</p>'; 
            echo '<p>' . $row["timestamp"] . '</p>';
            
            echo '</div>';  
        }
    } 
    $conn->close();
    ?>
    </segment>
    <nav id="pageFlipper">
    <?php 
        $inactive = "class='inactive'";
        $previousLink = "window.location.href='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "?page=" . ($currentPage - 1) . "'";
        $nextLink = "window.location.href='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "?page=" . ($currentPage + 1) . "'";
        $previousButton = ($currentPage > 1) ? 'onclick="' . $previousLink . '"' : $inactive;
        $nextButton = ($currentPage < $maxPages) ? 'onclick="' . $nextLink . '"' : $inactive;
    ?>
        <button id="previous" <?php echo $previousButton; ?>>
            <img src="assets/leftArrow.svg">
            <h3>previous</h3>
        </button>
        <button id="next" <?php echo $nextButton; ?>>
            <h3>next</h3>
            <img src="assets/rightArrow.svg">
        </button>
    </nav>
    <footer>
        <hr class="divider">
        <button id="returnbutton" onclick="location.href='http://www.planetegem.be'" type="button">
            <img id="return">
            <h4>return&nbsp;to<br>planetegem</h4>
        </button>
        <p>Images were created by users as part of the game <a href="index.php" style="text-decoration:none">"Prove you're a robot"</a>. If you want one of your images taken down, please contact me.</p>
        <p>&#169; programming & concept 2023 Niels Van Damme | info@planetegem.be | <a href="https://www.instagram.com/planetegem/" style="text-decoration:none">www.instagram.com/planetegem</a></p>
    </footer>
</main>
</body>