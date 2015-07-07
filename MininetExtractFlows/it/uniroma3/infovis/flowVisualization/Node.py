class Node:
    __nodeType = None;
    __name = None;
    __interfaces = None;

    def __init__(self, nodeType, name, interfaces):
        self.__nodeType = nodeType;
        self.__name = name;
        self.__interfaces = interfaces;

    def get_type(self):
        return self.__nodeType;

    def get_name(self):
        return self.__name;

    def get_interfaces(self):
        return self.__interfaces;

    def returnDict(self):
        """
        Return a dictionary with all attributes for this object
        """
        dictAttributes = dict();
        for attr in dir(Node):
            if attr.startswith("_Node__") and eval("self." + attr) != None:
                dictAttributes[attr[7:]] = eval("self." + attr);
        return dictAttributes;

    def __str__(self):
        return "NODE: type = " + self.__nodeType + "; name = " + self.__name + "; interfaces = " + str(self.__interfaces);
