// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title 投票合约
 * @dev 实现投票流程以及投票委托功能
 */
contract Ballot {
    struct Voter {
        uint weight; // 投票权重,通过委托累积
        bool voted; // 是否已投票标记
        address delegate; // 委托人地址
        uint vote; // 投票提案的索引
    }

    struct Proposal {
        // 如果可以将长度限制为特定字节数，
        // 建议使用bytes1到bytes32，因为它们更节省gas
        bytes32 name; // 提案名称(最多32字节)
        uint voteCount; // 累计投票数
    }

    address public chairperson; // 主席地址

    mapping(address => Voter) public voters; // 投票人映射

    Proposal[] public proposals; // 提案数组

    /**
     * @dev 创建一个新的投票以选择提案
     * @param proposalNames 提案名称数组
     */
    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            // 创建新的提案对象并添加到提案数组中
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    /**
     * @dev 获取所有提案列表
     * @return 返回提案数组
     */
    function getVoteList() public view returns (Proposal[] memory) {
        Proposal[] memory voteList = new Proposal[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            voteList[i] = proposals[i];
        }
        return voteList;
    }

    /**
     * @dev 授予投票权，只能由主席调用
     * @param voter 投票人地址
     */
    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "only chairperson can give right to vote"
        );
        require(!voters[voter].voted, "the voter has already voted");
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    /**
     * @dev 将投票权委托给其他投票人
     * @param to 被委托人地址
     */
    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "you have already voted");
        require(to != msg.sender, "self-delegation is disallowed");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "found loop in delegation");
        }

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            // 如果被委托人已经投票，直接增加投票数
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // 如果被委托人还未投票，增加其权重
            delegate_.weight += sender.weight;
        }
    }

    /**
     * @dev 进行投票(包括被委托的票数)
     * @param proposal 提案在数组中的索引
     */
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "no right to vote");
        require(!sender.voted, "already voted");
        sender.voted = true;
        sender.vote = proposal;

        // 如果proposal超出数组范围，
        // 将自动抛出异常并回滚所有更改
        proposals[proposal].voteCount += sender.weight;
    }

    /**
     * @dev 计算获胜提案
     * @return winningProposal_ 获胜提案在数组中的索引
     */
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /**
     * @dev 获取获胜提案的名称
     * @return winnerName_ 获胜提案的名称
     */
    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
