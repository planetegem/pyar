<?php session_start(); ?>
<?php

// Calculate folder size (as security)
// https://gist.github.com/eusonlito/5099936
function folderSize($dir) {
    $size = 0;

    foreach (glob(rtrim($dir, "/") . "/*", GLOB_NOSORT) as $each) {
        $size += is_file($each) ? filesize($each) : folderSize($each);
    }
    return $size;
}

if (strtoupper($_SERVER['REQUEST_METHOD']) === 'POST'){
    // 1. RETRIEVE USERNAME
    function validateUsername($data){
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        
        if (empty($data)){
            $data = "anonymous";
        }
        return $data;
    }
    $username = validateUsername($_POST["username"]);
    $usernameNew = validateUsername($_POST["usernameNew"]);
    
    //2. RETRIEVE PROMPT (STRUCTURED BY JS)
    $prompt = $_POST["sendPrompt"];
    
    //3. CHECK IF FOLDER IS FULL
    $folderSize = folderSize("output")/(1024*1024);
    if ($folderSize > 500){
        $_SESSION["gamestate"] = "error";
        $_SESSION["error"] = "Image directory is full: contact administrator.";
    } else {
        //4. RETRIEVE IMAGE & SAVE TO DIR
        $png = $_POST["sendImage"];
        $png = str_replace("data:image/png;base64,", "", $png);
        $png = str_replace(" ", "+", $png);
        $tempusername = str_replace(" ", "_", $usernameNew);
        $data = base64_decode($png);
        $file = "output/" . $prompt . "_by_" . $tempusername . ".png";
        $success = file_put_contents($file, $data);
        
        // 5. POST TO DB
        $query = $conn->query(
            "INSERT INTO pyarList(username, prompt)
            VALUES ('" . $usernameNew . "', '" . $prompt . "')"
        );
        if ($query === TRUE){
            // 6. SAVE VALUES TO SESSION
            $_SESSION["username"] = $username;
            $_SESSION["usernameNew"] = $usernameNew;
            $_SESSION["gamestate"] = "end";
        } else {
            $_SESSION["gamestate"] = "error";
            $_SESSION["error"] = "Error adding record: " . $conn->error;
        }
    }
    // REDIRECT TO GET
    header("Location: index.php", true, 303);
    exit();
}
$conn->close();
?>

<!DOCTYPE html>
<html xmlns="https://www.w3.org/1999/xhtml" lang="nl" xml:lang="nl">
<head>
    <meta http-equiv='content-type' content='text/html; charset=UTF-8'>
    <meta name="description" content="Prove you're a robot, or else!">
    <meta name="keywords" content="paint, image editing, AI image generator, browser game, HTML5 game">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="googlebot" content="notranslate">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Niels Van Damme">
    <title>Prove you're a robot - the game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <segment id="prompt">
            <div id="promptField">
                <p>a human has prompted you to draw</p>
                <div id="realPrompt">
                    <p>"<span id="targetField">prompt incoming</span>"</p>
                </div>
            </div>
            <div id="promptButtons">
                <button id="promptRequest" class="button">
                    <img src="assets/recycle.svg">
                </button>
                <button id="submitButton" class="button">
                    <h3>submit image</h3>
                </button>
            </div>
        </segment>
        <segment id="workspace">
            <canvas id="cursorCanvas" class="canvas"></canvas>
            <canvas id="canvas-layer1" class="canvas" style="z-index: 1;"></canvas>
            <canvas id="final-canvas" class="canvas" style="z-index: 1;"></canvas>
        </segment>
        <segment id="mainMenu">
            <div id="brushSelector" class="menu-item">
                <h2>brush selector</h2>
                <p class="infoText">Choose between the pencil, line and eraser tool. Desktop users can also shortcut to the collage tool.</p>
                <div id="penOptions">
                    <button id="pencil" class="button">
                        <img src="assets/pencil.svg">
                    </button>
                    <button id="line" class="button">
                        <img src="assets/line.svg">
                    </button>
                    <button id="eraser" class="button">
                        <img src="assets/eraser.svg">
                    </button>
                    <button id="collage" class="button">
                        <img src="assets/collage.svg">
                    </button>
                </div>
                <div id="penSize">
                    <h4>brush size:</h4>
                    <div id="sizeSlider-container">
                        <canvas id="sizeSlider" class="slider"></canvas>
                        <span id="sizeModifier"></span>
                    </div>
                </div>
            </div>
            <div id="colorSelector" class="menu-item">
                <h2>color selector</h2>
                <p class="infoText">Mix the colors you want and apply them to your brush.</p>
                <canvas id="colorWheel"></canvas>
                <div id="colorOptions">
                    <h4>saturation:</h4>
                    <canvas id="saturation" class="slider"></canvas>
                    <h4>lightness:</h4>
                    <canvas id="lightness" class="slider"></canvas>
                    <h4>opacity:</h4>
                    <canvas id="opacity" class="slider"></canvas>
                </div>
                <div id="colorCodes">
                        <span class="label">h:</span>
                        <span class="value" id="hue"></span>
                        <span class="label">s:</span>
                        <span class="value" id="sat"></span>
                        <span class="label">l:</span>
                        <span class="value" id="light"></span>
                        <span class="label">r:</span>
                        <span class="value" id="red"></span>
                        <span class="label">g:</span>
                        <span class="value" id="green"></span>
                        <span class="label">b:</span>
                        <span class="value" id="blue"></span>
                </div>
            </div>
        </segment>
        <segment id="advancedMenu">
            <div id="collageTool" class="menu-item">
                <h2>collage selector</h2>
                <p class="infoText">Upload an image to paint it on the canvas. Max file size is 2MB, square images are advised.</p>
                <div id="example">
                    <img id="collageExample" src="assets/blank.svg">
                    <canvas id="collageSelector"></canvas>
                </div>
                <div id="cropZone">
                    <label for="crop">
                        <h4>crop image:</h4>
                    </label>
                    <input type="checkbox" id="crop" name="crop">
                    <h4>crop size:</h4>
                    <canvas id="collageSlider"></canvas>
                </div>
                <label id="newImage" for="collageButton" class="button">
                    <h3>select image</h3>
                </label>
                <input type="file" id="collageButton" name="collage" accept="image/png, image/jpg, image/jpeg, image/svg" style="display: none;">
            </div>
            <div id="layerSelector" class="menu-item">
                <h2>layer selector</h2>
                <p class="infoText">Add layers to facilitate drawing. Up to 6 layers can be added.</p>
                <div id="layers">
                    <span id="layer1" class="selected layer">layer 1</span>
                </div>
                <button id="addLayer" class="button">+</button>
            </div>
        </segment>
        
        <!-- MOB MENU -->
        <segment id="mobBrush" class="mobile">
            <div class="mob-menu-item">
                <div id="mobBrush-container">
                    <h2>brush:</h2>
                    <button id="pencilMob" class="button mobile">
                        <img src="assets/pencil.svg">
                    </button>
                    <button id="lineMob" class="button mobile">
                        <img src="assets/line.svg">
                    </button>
                    <button id="eraserMob" class="button mobile">
                        <img src="assets/eraser.svg">
                    </button>
                </div>
                <div id="mobSize-container">
                    <h2>size:</h2>
                    <canvas id="mobSizeSlider"></canvas>
                    <span id="mobSizeModifier"></span>
                </div>
            </div>
        </segment>
        <segment id="mobColor" class=mobile>
            <div class="mob-menu-item">
                <canvas id="mobColorWheel"></canvas>
                <div id="mobColorOptions">
                    <h2>saturation:</h2>
                    <canvas id="mobSaturation" class="slider"></canvas>
                    <h2>lightness:</h2>
                    <canvas id="mobLightness" class="slider"></canvas>
                    <h2>opacity:</h2>
                    <canvas id="mobOpacity" class="slider"></canvas>
                </div>
            </div>
        </segment>
        
        <!-- OVERLAYS -->
        <segment id="overlay" class="overlay"></segment>
        <segment id="evaluating" class="overlay popup">
            <div id="logoContainer">
                <img id="cog" src="assets/cog.svg">
                <img id="foreground" src="assets/pyarForeground.svg">
            </div>
            <p id="evalText"></p>
        </segment>
        <segment id="captcha" class="overlay popup">
            <img id="startLogo" src="assets/pyarLogo.svg">
            <p id="startText">please confirm you're a robot</p>
            <div id="captchaField">
                <div id="captchaCheckbox">
                    <span id></span>
                </div>
                <h2>i am a robot</h2>
            </div>
        </segment>
        <segment id="submitMenu" class="overlay popup">
            <button id="cancelSubmit">x</button>
            <h1 id="submitHeader">automatic report</h1>
            <p id="conclusion" class="infoText"></p>
            <h2 id="previewImage">preview image:</h2>
            <img id="finalCanvasPreview" src="assets/blank.svg">
            <p id="submitPrompt"></p>
            <form id="submitForm" method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                <label for="username" id="username-container">
                    <p>generated by</p>
                    <input type="text" id="username" name="username" maxlength="20">
                </label>
                <div id="submit-container">
                    <div class="button" id="submitImageFinal">
                        <h3>submit to database</h3>
                    </div>
                    <div class="button" id="download">
                        <img src="assets/dlBox.svg" id="dlBox">
                        <img src="assets/dlArrow.svg" id="dlArrow">
                    </div>
                </div>
                <div style="display:none;">
                    <canvas id="downsizer"></canvas>
                    <input type="text" id="sendPrompt" name="sendPrompt">
                    <input type="text" id="usernameNew" name="usernameNew">
                    <input type="submit" value="submit" id="imageFormSubmit" name="imageFormSubmit">
                    <input type="text" id="sendImage" name="sendImage">
                </div>
            </form>
            <div id="exitChoices">
                <button class="button" onclick="window.open('output.php')">
                    <h3>visit database</h3>
                </button>
                <button class="button" id="restartButton">
                    <img src="assets/recycle.svg">
                </button>
            </div>
            <div id="exitChoicesFinal">
                <button class="button" id="nextPrompt">
                    <h3 id="nextPromptLabel">next prompt</h3>
                </button>
                <button class="button" id="visitDB" onclick="window.open('output.php')">
                    <h3>visit database</h3>
                </button>
            </div>
        </segment>
    </main>
    <script src="/demo/prompt_builder/assets/promptGenerator/commons.js"></script>
    <script src="/demo/prompt_builder/assets/promptGenerator/promptGenerator.js"></script>
    <?php 
        $phpVar = (isset($_SESSION["gamestate"]) ? $_SESSION["gamestate"] : "start");
        $username = (isset($_SESSION["username"]) ? $_SESSION["username"] : "anonymous");
        $usernameNew = (isset($_SESSION["usernameNew"]) ? $_SESSION["usernameNew"] : "anonymous");
        $error = (isset($_SESSION["error"]) ? $_SESSION["error"] : "none");
        
        echo "<script>let gamestate = '" . $phpVar . "', username = '" . $username . "', usernameNew = '" . $usernameNew . "', phpError = '" . $error . "';</script>";
    ?>
    <script src="js/tools.js"></script>
    <script src="js/listeners.js"></script>
    <script src="js/mobile.js"></script>
    <script src="js/dialogue.js"></script>
    <script src="js/menu.js"></script>
    <script src="js/captcha.js"></script>
</body>
<?php unset($_SESSION["gamestate"]); ?>