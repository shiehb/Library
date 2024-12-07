<?php
session_start();
session_unset();
session_destroy();

header("Location: /library-system/index.php");
exit;
?>
