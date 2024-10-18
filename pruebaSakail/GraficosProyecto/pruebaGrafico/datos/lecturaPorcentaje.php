<?php
function LecturaEnPorcentaje(){
    $this-> query = 
    "SELECT 
            su.FIRST_NAME, 
            su.LAST_NAME, 
            /*ssu.SITE_ID,*/
            CONCAT(ROUND(
            IFNULL(
            (COUNT(se.EVENT) / NULLIF
            ((SELECT COUNT(*) 
            FROM sakail.SAKAI_EVENT
            WHERE EVENT = 'lessonbuilder.item.read' 
            AND CONTEXT = ssu.SITE_ID), 0)) * 100, 0), 2), '%') 
            AS Porcentaje_ingreso
            FROM 
                sakail.SAKAI_USER su
            JOIN 
                sakail.SAKAI_SITE_USER ssu ON su.USER_ID = ssu.USER_ID
            LEFT JOIN 
                sakail.SAKAI_SESSION ss ON ssu.USER_ID = ss.SESSION_USER
            LEFT JOIN 
                sakail.SAKAI_EVENT se ON ss.SESSION_ID = se.SESSION_ID AND se.EVENT = 'lessonbuilder.item.read' AND se.CONTEXT = ssu.SITE_ID
            WHERE 
                ssu.SITE_ID = 'PRO53-ON-LEGISLACION_AMBIENTAL_Y_GESTION_DE_RESIDUOS-2024-1'
                AND ssu.PERMISSION = '-1'
            GROUP BY 
                su.FIRST_NAME, su.LAST_NAME, ssu.SITE_ID
            ORDER BY 
                Porcentaje_ingreso ASC";
            }