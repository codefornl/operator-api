wget http://geodata.nationaalgeoregister.nl/wijkenbuurten2016/extract/wijkenbuurten2016.zip
unzip -j wijkenbuurten2016.zip -x "Uitvoer_shape/gem*" -x "Uitvoer_shape/wijk*"
ogr2ogr -f "PostgreSQL" PG:"host=localhost user=postgres dbname=operator_test" -t_srs EPSG:4326 buurt_2016.shp -nlt MULTIPOLYGON -nln buurt_2016

