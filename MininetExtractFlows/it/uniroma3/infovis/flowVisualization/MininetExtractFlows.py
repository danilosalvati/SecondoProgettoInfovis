#!/usr/bin/python
from Node import Node
import subprocess as subprocess;
from Flow import Flow
from json.encoder import JSONEncoder
import sys

class MininetExtractFlows:
    __nodes = None;
    __flows = None;

    def parseFlow(self, line):
        """
        Parse a single line of text and build a flow
        """
        if line != "":
            splitted = line.split(",");
            return Flow(splitted[0].split("=")[1], splitted[1].split("=")[1], splitted[2].split("=")[1],
                        splitted[3].split("=")[1], splitted[4].split("=")[1], splitted[5].split("=")[1],
                        splitted[6].split("=")[1], splitted[7], splitted[8].split("=")[1],
                        splitted[9].split("=")[1], splitted[10].split("=")[1], splitted[11].split("=")[1],
                        splitted[12].split("=")[1], splitted[13].split("=")[1], splitted[14]);

    def read_flows(self):
        """
        read flows from all switch and saves them
        """
        nodes = self.get_nodes();
        self.__flows = dict();
        for node in nodes:
            if node.get_type() == 'OVSSwitch':
                self.__flows[node.get_name()] = list();

        try:
            output = subprocess.check_output(["ovs-ofctl", "dump-flows", node.get_name(), "--rsort"]);
            lines = output.split("\n")[1:];
            for line in lines:
                if line != "":
                    self.__flows[node.get_name()].append(self.parseFlow(line));

        except subprocess.CalledProcessError as e:
            print e.output;

#                 in_file = open("/home/danilo/flows_" + node.get_name() + ".txt", "r")
#                 output = in_file.read()
#                 in_file.close();



    def parseNode(self, line):
        """
        Parse a single line of text and return a node
        """
        # First I get all fields of node
        splitted = line.split();

        # Now I build the list with node interfaces and addresses
        interfacesStr = splitted[2].split(",");
        interfaces = dict();
        for interfaceStr in interfacesStr:
            spl = interfaceStr.split(":");
            interfaces[spl[0]] = spl[1];
        return Node(splitted[0][1:], splitted[1][:-1], interfaces);

    def read_dump(self, dumpPath):
        """
        Reads dump file and saves all nodes info
        """

        # Open file and add nodes to list
        self.__nodes = list();
        in_file = open(dumpPath, "r")
        for line in in_file:
            self.__nodes.append(self.parseNode(line));
        in_file.close()


    def get_nodes(self):
        return self.__nodes;

    def get_flows(self):
        return self.__flows;

    def main(self):
        inputFile = sys.argv[1];
        outputDirectory = sys.argv[2];
        outputScp = sys.argv[3];
        mininetOutputDirectory = "/home/mininet";

        # Test!
        # inputFile = "/home/danilo/dump.txt";
        # outputDirectory = "/home/danilo";
        # outputScp = "danilo@192.168.1.11:/home/danilo/";

        mininetExtractFlows = MininetExtractFlows();

        # Ottengo le flowTable
        mininetExtractFlows.read_dump(inputFile);
        mininetExtractFlows.read_flows();

        # Salvo i json dei due oggetti su file
        nodeDict = dict();
        nodeDict["data"] = list();
        flowDict = dict();

        for node in mininetExtractFlows.get_nodes():
            nodeDict["data"].append(node.returnDict());
            if node.get_type() == 'OVSSwitch':
                flowDict[node.get_name()] = list();
                # I create an id for every flow
                idFlow = 0;
                for flow in mininetExtractFlows.get_flows()[node.get_name()]:
                    diction = flow.returnDict();
                    diction['id'] = str(idFlow);
                    idFlow += 1;
                    flowDict[node.get_name()].append(diction);

        # Scrive il file json dei nodi
        out_file = open(outputDirectory + "/JSONNodes.json", "w");
        out_file.write(JSONEncoder().encode(nodeDict));
        out_file.close();

        # Scrive il file json dei flows
        out_file = open(outputDirectory + "/JSONFlows.json", "w");
        out_file.write(JSONEncoder().encode(flowDict));
        out_file.close();

        # Copio i file da mininet al computer locale
        subprocess.call(["scp", mininetOutputDirectory + "/JSONNodes.json", outputScp]);
        subprocess.call(["scp", mininetOutputDirectory + "/JSONFlows.json", outputScp]);
        # scp foobar.txt your_username@remotehost.edu:/some/remote/directory

if __name__ == '__main__':
    mininetExctractFlows = MininetExtractFlows();
    mininetExctractFlows.main();
