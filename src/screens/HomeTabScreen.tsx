import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { getDatabase, onValue, ref } from 'firebase/database';
import { Candidate, VoteHistoryItem } from '../types/app';
import PieChartComponent from '../component/PieChart';
import { API_URL } from '@env';
import { BigNumber } from '@ethersproject/bignumber';

type HomeTabScreenProps = {
    election_id: string;
};
interface VoteHistory {
    idCandidate: BigNumber;
    voteCount: BigNumber;
    timestamp: BigNumber;
    transactionHash: string;
    blockNumber: BigNumber;
}

const HomeTabScreen: React.FC<HomeTabScreenProps> = ({ election_id }) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [voteHistories, setVoteHistories] = useState<VoteHistory[]>([]);
    const [filteredHistories, setFilteredHistories] = useState<VoteHistory[]>([]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const db = getDatabase();
                const candidatesRef = ref(db, 'candidates');

                onValue(candidatesRef, async (snapshot) => {
                    const data = snapshot.val();
                    const candidatesArray: Candidate[] = Object.values(data);
                    const filteredCandidates = candidatesArray.filter(candidate =>
                        candidate.elections.includes(election_id.toString())
                    );

                    // Fetch vote counts for each candidate
                    const candidatesWithVoteCounts = await Promise.all(filteredCandidates.map(async (candidate) => {
                        const response = await fetch(`${API_URL}/getCandidateVoteCount/${election_id}/${candidate.candidate_id}`);
                        const voteData = await response.json();
                        candidate.voteCount = parseInt(voteData.voteCount.hex, 16);
                        return candidate;
                    }));

                    // Sort candidates by candidate_id in ascending order
                    candidatesWithVoteCounts.sort((a, b) => a.candidate_id - b.candidate_id);

                    setCandidates(candidatesWithVoteCounts);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Error fetching candidates: ", error);
                setLoading(false);
            }
        };

        fetchCandidates();

        const fetchVoteHistory = async () => {
            try {
                const response = await fetch(`${API_URL}/getAllVotes`);
                const data = await response.json();
                const formattedData: VoteHistory[] = data.map((item: any[], index: number) => {
                    // Check if the item has all the expected elements
                    if (item.length < 7) {
                        console.warn(`Incomplete data for item ${index}:`, item);
                        return null;
                    }

                    try {
                        return {
                            idCandidate: BigNumber.from(item[1]?.hex || '0'),
                            voteCount: BigNumber.from(item[3]?.hex || '0'),
                            timestamp: BigNumber.from(item[4]?.hex || '0'),
                            transactionHash: typeof item[5] === 'string' ? item[5] : 'N/A',
                            blockNumber: BigNumber.from(item[6]?.hex || '0'),
                        };
                    } catch (error) {
                        console.error(`Error processing item ${index}:`, error);
                        return null;
                    }
                }).filter((item: VoteHistory | null): item is VoteHistory => item !== null);

                setVoteHistories(formattedData);
                setFilteredHistories(formattedData);
            } catch (error) {
                console.error("Error fetching vote history: ", error);
            }
        };

        fetchVoteHistory();
    }, [election_id]);

    const renderCandidateItem = ({ item }: { item: Candidate }) => (
        <View style={styles.candidateItem} key={item.candidate_id}>
            <View style={styles.candidateIdCircle}>
                <Text style={styles.candidateId}>{item.candidate_id}</Text>
            </View>
            <Text style={styles.candidateName}>{item.name}</Text>
            <View style={styles.candidateDetails}>
                <Text style={styles.candidateDetailTitle}>Vision</Text>
                <Text style={styles.candidateVisi}>{item.vision}</Text>
                <Text style={styles.candidateDetailTitle}>Mission</Text>
                <Text style={styles.candidateMisi}>{item.mission}</Text>
                <Text style={styles.voteCount}>Votes: {item.voteCount}</Text>
            </View>
        </View>
    );

    const renderVoteHistoryItem = ({ item }: { item: VoteHistory }) => (
        <View style={styles.historyItem}>
            <Text style={styles.historyText}>Candidate ID: {item.idCandidate.toString()}</Text>
            <Text style={styles.historyText}>Vote Count: {item.voteCount.toString()}</Text>
            <Text style={styles.historyText}>Timestamp: {formatDateTime(item.timestamp.toString())}</Text>
            <Text style={styles.historyText}>Transaction Hash: {item.transactionHash.slice(0, 10)}...</Text>
            <Text style={styles.historyText}>Block Number: {item.blockNumber.toString()}</Text>
        </View>
    );

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text) {
            const filtered = voteHistories.filter(history =>
                history.idCandidate.toString().includes(text)
            );
            setFilteredHistories(filtered);
        } else {
            setFilteredHistories(voteHistories);
        }
    };

    const formatDateTime = (timestamp: string) => {
        if (!timestamp) return 'Invalid date';
        try {
            const unixTimestamp = BigNumber.from(timestamp).toNumber();
            const dateObj = new Date(unixTimestamp * 1000);
            return dateObj.toLocaleString(); // Adjust based on your localization preferences
        } catch (error) {
            return 'Invalid date';
        }
    };

    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
    const chartData = candidates.map((candidate, index) => ({
        name: '% ' + candidate.name,
        population: totalVotes ? (candidate.voteCount / totalVotes) * 100 : 0,
        color: ["#96c31f", "#f5a623", "#f05656", "#50e3c2", "#4a90e2"][index % 5],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
        key: `chart-${candidate.name}-${index}`
    }));

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>Candidate List</Text>
                        <FlatList
                            data={candidates}
                            renderItem={renderCandidateItem}
                            keyExtractor={(item) => item.candidate_id.toString()}
                            contentContainerStyle={styles.listContainer}
                        />
                        <Text style={styles.title}>Vote Counting Results</Text>
                        <PieChartComponent data={chartData} />
                        <View style={styles.voteHistoryContainer}>
                            <TextInput
                                style={styles.searchBar}
                                placeholder="Search by candidate ID"
                                value={searchText}
                                onChangeText={handleSearch}
                            />
                        </View>
                    </>
                }
                ListFooterComponent={
                    <FlatList
                        data={filteredHistories}
                        keyExtractor={(item, index) => `vote-history-${index}`}
                        renderItem={renderVoteHistoryItem}
                        contentContainerStyle={styles.listContent}
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 6,
        marginTop: 20,
        color: '#EC8638',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContainer: {
        flexGrow: 1,
        width: '100%',
        paddingHorizontal: 16,
    },
    candidateItem: {
        backgroundColor: '#FAECE0', // Slightly transparent background
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        marginTop: 13,
        marginLeft: 10,
        position: 'relative', // Ensure the absolute positioning of the circle works within this container
    },
    candidateIdCircle: {
        position: 'absolute',
        top: -10,
        left: -10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EC8638',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    candidateId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    candidateName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#000',
        textAlign: 'center',
    },
    candidateDetails: {
        marginBottom: 8,
    },
    candidateDetailTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EC8638',
        marginBottom: 3,
    },
    candidateVisi: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#000',
        textAlign: 'center',
    },
    candidateMisi: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#000',
    },
    voteCount: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    historyItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 32,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EC8638',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginVertical: 4,
    },
    historyText: {
        fontSize: 13,
        color: '#495057',
    },
    searchBar: {
        height: 40,
        width: Dimensions.get('window').width - 32,
        borderColor: '#EC8638',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    listContent: {
        width: '100%',
        paddingBottom: 16,
    },
    voteHistoryContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        height: 40,
    },
});

export default HomeTabScreen;
