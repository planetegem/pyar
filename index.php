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
        include "connection.php";
        try {
            $conn = new mysqli($servername, $username, $password, $database);
            $query = $conn->query(
                "INSERT INTO pyarList(username, prompt)
                VALUES ('" . $usernameNew . "', '" . $prompt . "')"
            );
            if ($query === FALSE){
                $_SESSION["error"] = "Error adding record: " . $conn->error;
            }
            $conn->close();
        } catch (Exception $e){
            $_SESSION["error"] = "Error adding record: " . $e->getMessage();
        }
    }
    // REDIRECT TO GET
    header("Location: index.php", true, 303);
    exit();
}
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
    <link rel="stylesheet" href="style/main.css">
</head>

<body>
    <main>

        <section id="prompt">
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
        </section>

        <section id="workspace">
            <canvas id="cursorCanvas" class="canvas"></canvas>
            <canvas id="canvas-layer1" class="canvas" style="z-index: 1;"></canvas>
            <canvas id="finalCanvas" class="canvas" style="z-index: 1;"></canvas>
        </section>

        <aside id="mainMenu">
            <section id="brushSelector" class="menu-item">
                <h2></h2>
                <p class="infoText desktop">Choose between the pencil, line and eraser tool. Desktop users can also shortcut to the collage tool.</p>
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
                    <button id="collage" class="button desktop">
                        <img src="assets/collage.svg">
                    </button>
                </div>
                <div id="penSize">
                    <h4></h4>
                    <div id="sizeSlider-container">
                        <canvas id="sizeSlider" class="slider"></canvas>
                        <span id="sizeModifier" class="desktop"></span>
                    </div>
                </div>
            </section>

            <section id="colorSelector" class="menu-item">
                <h2></h2>
                <p class="infoText desktop">Mix the colors you want and apply them to your brush.</p>
                <canvas id="colorWheel"></canvas>
                <div id="colorOptions">
                    <h4>saturation:</h4>
                    <canvas id="saturation" class="slider"></canvas>
                    <h4>lightness:</h4>
                    <canvas id="lightness" class="slider"></canvas>
                    <h4>opacity:</h4>
                    <canvas id="opacity" class="slider"></canvas>
                </div>
                <div id="colorCodes" class="desktop">
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
            </section>
        </aside>
        
        <aside id="advancedMenu" class="desktop">
            <section id="collageTool" class="menu-item">
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
            </section>
            <section id="layerSelector" class="menu-item">
                <h2>layer selector</h2>
                <p class="infoText">Add layers to facilitate drawing. Up to 6 layers can be added.</p>
                <div id="layers">
                    <span id="layer1" class="selected layer">layer 1</span>
                </div>
                <button id="addLayer" class="button">+</button>
            </section>
            <section id="saveMenu">
                <button class="button" id="saveButton">
                    <img src="assets/download.svg">
                    <h3>save</h3>
                </button>
                <button class="button" id="loadButton">
                    <img src="assets/upload.svg">
                    <h3>load</h3>
                </button>
                <input type="file" id="saveReader" style="display:none;" accept=".txt">
            </div>
        </aside>
    </main>

        
    <!-- Dialogs -->
    <dialog id="evaluating">
        <div id="logoContainer">
            <img id="cog" src="assets/cog.svg">
            <img id="foreground" src="assets/pyarForeground.svg">
        </div>
        <p id="evalText"></p>
    </dialog>

    <dialog id="captcha">
        <img class="logo" src="assets/pyarLogo.svg">
        <p>
            Welcome to Prove you're a Robot&#x2122! 
            <br>
            Please check the box below to confirm you're a robot.
        </p>
        <div id="captchaField">
            <span id="topMask"></span>
            <span id="bottomMask"></span>
            <div id="captchaCheckbox">
                <span id></span>
            </div>
            <h2>i am a robot</h2>
        </div>
    </dialog>

    <dialog id="feedback">
        <img class="logo" src="assets/pyarLogo.svg">
        <div id="feedbackField"></div>
        <button id="feedbackConfirm" class="button"></button>
    </dialog>

    <dialog id="submitMenu">
        <img class="logo" src="assets/pyarLogo.svg">
        <button id="cancelSubmit">x</button>
        <h2>automatic report</h2>
        <p id="conclusion"></p>
        <h3>your creation:</h3>
        <img id="finalCanvasPreview" src="assets/blank.svg">
        <p id="submitPrompt"></p>
        <form id="submitForm" method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
            <label for="username" id="username-container">
                <p>generated by</p>
                <input type="text" id="username" name="username" maxlength="20">
            </label>
            <div id="submit-container">
                <button type="button" class="button" id="submitImageFinal">
                    <h3>submit to database</h3>
                </button>
                <button type="button" class="button" id="download">
                    <img src="assets/dlBox.svg" id="dlBox">
                    <img src="assets/dlArrow.svg" id="dlArrow">
                </button>
            </div>
            <!-- secret data sent when submitting! -->
            <div style="display:none;">
                <canvas id="downsizer"></canvas>
                <input type="text" id="sendPrompt" name="sendPrompt">
                <input type="text" id="usernameNew" name="usernameNew">
                <input type="submit" value="submit" id="imageFormSubmit" name="imageFormSubmit">
                <input type="text" id="sendImage" name="sendImage">
            </div>
        </form>  
    <dialog>
    
    <!-- log php error -->
    <?php 
        if (isset($_SESSION["error"])){
            echo "<script>let phpError = '" . $_SESSION["error"] . "';</script>";
        } else {
            echo "<script>let phpError = null;</script>";
        }
    ?>

    <!-- link to prompt generator -->
    <script src="https://www.planetegem.be/demo/prompt_builder/assets/promptGenerator/commons.js"></script>
    <script src="https://www.planetegem.be/demo/prompt_builder/assets/promptGenerator/promptGenerator.js"></script>

    <!-- main gameplay -->
    <script src="js/drawMethods/commons.js"></script>
    <script src="js/drawMethods/colorwheel.js"></script>
    <script src="js/drawMethods/pen.js"></script>
    <script src="js/drawMethods/layer.js"></script>
    <script src="js/drawMethods/collage.js"></script>
    <script src="js/drawMethods/canvas.js"></script>
    <script src="js/drawMethods/listeners.js"></script>
    <script src="js/drawMethods/save.js"></script>

    <!-- Dialogs and gameflow -->
    <script src="js/resources.js"></script>
    <script src="js/dialogs.js"></script>
    <script src="js/main.js"></script>
    
    
</body>
<?php unset($_SESSION["error"]); ?>