class Flow:
    __cookie = None;
    __duration = None;
    __table = None;
    __n_packets = None;
    __n_bytes = None;
    __idle_timeout = None;
    __priority = None;
    __packetType = None;
    __in_port = None;
    __vlan_tci = None;
    __dl_src = None;
    __dl_dst = None;
    __ip_add_in = None;
    __ip_add_out = None;
    __actions = None;

    def __init__(self, cookie, duration, table, n_packets, n_bytes, idle_timeout, priority,
                 packetType, in_port, vlan_tci, dl_src, dl_dst, ip_add_in, ip_add_out, actions):

        self.__cookie = cookie;
        self.__duration = duration;
        self.__table = table;
        self.__n_packets = n_packets;
        self.__n_bytes = n_bytes;
        self.__idle_timeout = idle_timeout;
        self.__priority = priority;
        self.__packetType = packetType;
        self.__in_port = in_port;
        self.__vlan_tci = vlan_tci;
        self.__dl_src = dl_src;
        self.__dl_dst = dl_dst;
        self.__ip_add_in = ip_add_in;
        self.__ip_add_out = ip_add_out;
        self.__actions = actions;



    def get_cookie(self):
        return self.__cookie;

    def get_duration(self):
        return self.__duration;
    def get_table(self):
        return self.__table;
    def get_n_packets(self):
        return self.__n_packets;
    def get_n_bytes(self):
        return self.__n_bytes;
    def get_idle_timeout(self):
        return self.__idle_timeout;
    def get_priority(self):
        return self.__priority;
    def get_packetType(self):
        return self.__packetType;
    def get_in_port(self):
        return self.__in_port;
    def get_vlan_tci(self):
        return self.__vlan_tci;
    def get_dl_src(self):
        return self.__dl_src;
    def get_dl_dst(self):
        return self.__dl_dst;
    def get_ip_add_in(self):
        return self.__ip_add_in;
    def get_ip_add_out(self):
        return self.__ip_add_out;
    def get_actions(self):
        return self.__actions;

    def returnDict(self):
        """
        Return a dictionary with all attributes for this object
        """
        dictAttributes = dict();
        for attr in dir(Flow):
            if attr.startswith("_Flow__") and eval("self." + attr) != None:
                dictAttributes[attr[7:]] = eval("self." + attr);

        return dictAttributes;

    def __str__(self):
        return "FLOW: duration = " + self.__duration + "; packetType = " + self.__packetType + "; ip source = " + self.__ip_add_in + "; ip destination = " + self.__ip_add_out;
