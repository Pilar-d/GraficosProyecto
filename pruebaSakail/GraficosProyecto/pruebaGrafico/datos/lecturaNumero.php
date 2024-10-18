<?php
 
function lecturaEnNumero(){
    $this -> query = 
    "SELECT su.FIRST_NAME, su.LAST_NAME, ssu.SITE_ID, COUNT(*) 
    AS veces_ingresado
    FROM sakail.SAKAI_USER su
    JOIN sakail.SAKAI_SITE_USER ssu 
    ON su.USER_ID = ssu.USER_ID
    JOIN sakail.SAKAI_USER_ID_MAP suim 
    ON su.USER_ID = suim.USER_ID
    JOIN sakail.SAKAI_SESSION ss 
    ON suim.USER_ID = ss.SESSION_USER
    JOIN sakail.SAKAI_EVENT se 
    ON ss.SESSION_ID = se.SESSION_ID
    WHERE se.EVENT = 'lessonbuilder.item.read'
    AND ssu.SITE_ID = 'PRO51-ON-CALCULO_II-2024-1' 
    AND ssu.PERMISSION = '-1'
    GROUP BY su.USER_ID, su.FIRST_NAME, su.LAST_NAME, ssu.SITE_ID
    ORDER BY veces_ingresado ASC;"

}