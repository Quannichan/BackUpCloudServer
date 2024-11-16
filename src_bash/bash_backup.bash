#!/bin/bash

export DISPLAY=:0
export XAUTHORITY=/home/quannichan1308/.Xauthority

APIIP=""
API_URL="https://$APIIP/api/download" 
API_KEY="Bearer "                
SOURCE_DIR="../BackupFolder"            # Thu muc sao luu
SOURCE_DIR_NAME="BackupFolder" 			# Ten thu muc sao luu
BACKUP_DIR="../BACKUP"                  # Thu muc luu
TEMP_DIR="../temp_backup"               # Thu muc luu tam de giai nen
BACKUP_FILE="$BACKUP_DIR/backup.zip" # Duong dan toi file duoc sao luu trong thu muc tam
ZIPPASS="13082004"
ISCHANGE=0
ISHASONSERVER=1

mkdir -p "$BACKUP_DIR" "$TEMP_DIR"
ress=$(curl -s -o "$TEMP_DIR/backup_downloaded.tar.gz" -w "%{http_code}" -X GET "$API_URL" \
     -H "Authorization: $API_KEY" -k )
     
if [ "$ress" -eq 000 ]; then
   	echo $ress
	ISHASONSERVER=0;
	zenity --info --text="Error cannot sync from server!" --title="Sync Notification"
	exit 0
fi

if [ "$ress" -eq 404 ]; then
    	echo $ress
	ISHASONSERVER=0;
	ISCHANGE=1
fi

   	echo $ress

# if [ ! -f "$TEMP_DIR/backup_downloaded.tar.gz" ]; then
#     notify-send "Error, cannot sync from server!"
# 	ISHASONSERVER=0
# 	ISCHANGE=1
# fi

if [ "$ISHASONSERVER" -eq 1 ]; then
	# tar -xzf "$TEMP_DIR/backup_downloaded.tar.gz" -C "$TEMP_DIR"
    unzip -P "$ZIPPASS" "$TEMP_DIR/$BACKUP_FILE" -d "$TEMP_DIR"

	changes=$(diff -qr "$SOURCE_DIR" "$TEMP_DIR/$SOURCE_DIR_NAME" | grep -E "Only in|differ")
	if [ -z "$changes" ]; then
		notify-send "Nothing change!"
		#zenity --info --text="Nothing change!" --title="Sync Notification"
		ISCHANGE=0
	else
	    	notify-send "File change detected! Sync..."
	    	#zenity --info --text="File change detected! Sync..." --title="Sync Notification"
	    	ISCHANGE=1
	fi
fi

if [ "$ISCHANGE" -eq 1 ]; then
	zip -r -P "$ZIPPASS" "$BACKUP_FILE" "$SOURCE_DIR"

	UPLOAD_URL="https://$APIIP/api/upload"
	response=$(curl -s -w "%{http_code}" -o /dev/null -X POST "$UPLOAD_URL" \
	    -H "Authorization: $API_KEY" \
	    -F "file=@$BACKUP_FILE" -k)

	if [ "$response" -ne 200 ]; then
	     notify-send "Sync failed, error: $response"
	    #zenity --info --text="Sync failed, error: $response" --title="Sync Notification"
	fi
fi

rm -rf "$TEMP_DIR"