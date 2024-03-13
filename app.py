import os
import io
import base64
import time
import datetime
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from datetime import timedelta
from flask import Flask, flash, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename
from scapy.all import rdpcap
from scapy.all import *
from scapy.all import TCP, UDP, ICMP, ARP, DNS

#Referenced from https://flask.palletsprojects.com/en/2.3.x/patterns/fileuploads/
#Referenced from https://www.digitalocean.com/community/tutorials/how-to-make-a-web-application-using-flask-in-python-3#step-3-using-html-templates


UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'
ALLOWED_EXTENSIONS = {'pcap'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename)) #file is saved  to uploads folder

            #Referenced from https://scapy.readthedocs.io/en/latest/usage.html

            #Packets are read
            packets = rdpcap(os.path.join(app.config['UPLOAD_FOLDER'], filename)) 

            #Packet Flow and Performance metrics

            #Traffic Volume

            total_data = sum(len(packet) for packet in packets)

            #Packet Rate

            total_packets = len(packets)

            global packet_counts
            packet_counts = {}
            interval = 60

            start_time = packets[0].time
            end_time = packets[-1].time
            current_time = start_time

            duration = end_time - start_time

            packet_rate = total_packets // duration

            while current_time <= end_time:
                count = sum(1 for packet in packets if current_time <= packet.time < current_time + interval)
                packet_counts[str(current_time)] = count
                current_time += interval

            #Protocol Distribution
            global tcp_count
            global udp_count
            global icmp_count
            global arp_count
            global dns_count
   

            tcp_count = 0
            udp_count = 0
            icmp_count = 0
            arp_count = 0
            dns_count = 0

            for packet in packets:
                if packet.haslayer(TCP):
                    tcp_count = tcp_count + 1
                if packet.haslayer(UDP):
                    udp_count = udp_count + 1
                if packet.haslayer(ICMP):
                    icmp_count = icmp_count + 1
                if packet.haslayer(ARP):
                    arp_count = arp_count + 1
                if packet.haslayer(DNS):
                    dns_count = dns_count + 1

                
            return render_template('index.html', total_data=total_data, packet_rate=packet_rate, total_packets=total_packets)
    return render_template('index.html')

@app.route('/get_counts')
def get_counts():
    return jsonify({
        'tcp_count': tcp_count,
        'udp_count': udp_count,
        'icmp_count': icmp_count,
        'arp_count': arp_count,
        'dns_count': dns_count
    })
@app.route('/get_packet')
def get_packet():
    return jsonify(packet_counts)

if __name__ == '__main__':
    app.run(debug=True)