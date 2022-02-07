pragma solidity >=0.6.0 <0.9.0;

contract SparkFi {

    string public name = "SparkFi";

    struct proposal {
        bytes32 contentId;
        uint value;
        address receivingAddress;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    struct venture {
        address ventureManager;
        bytes32 contentId;
        uint minimum;
        uint totalReceived;
        mapping (address => bool) investors;
        uint investorCount;
        mapping (bytes32 => proposal) proposals;
    }

    mapping (bytes32 => string) contentRegistry;
    mapping (bytes32 => venture) ventureRegistry;
    mapping (bytes32 => string) proposalRegistry;

    event VentureCreated(
        bytes32 indexed ventureId, 
        address indexed ventureManager, 
        bytes32 contentId, 
        uint indexed minimum
    );

    event ContentAdded(
        bytes32 indexed contentId, 
        string contentUri
    );

    event Invested(
        bytes32 indexed ventureId, 
        address indexed investor, 
        uint indexed amount
    );
    
    event ProposalCreated(
        bytes32 proposalId, 
        bytes32 indexed ventureId, 
        bytes32 contentId, 
        address indexed recipient,
        uint indexed amount
    );

    event ProposalApproved(
        bytes32 indexed proposalId, 
        bytes32 indexed ventureId,
        address indexed approver
    );

    event ProposalFinalized(
        bytes32 indexed proposalId, 
        bytes32 indexed ventureId
    );

    function createVenture(string calldata _contentUri, uint _minimum) external {
        address _manager = msg.sender;
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        bytes32 _ventureId = keccak256(abi.encodePacked(_manager, _contentId));

        contentRegistry[_contentId] = _contentUri;
        ventureRegistry[_ventureId].ventureManager = _manager;
        ventureRegistry[_ventureId].contentId = _contentId;
        ventureRegistry[_ventureId].minimum = _minimum;

        emit ContentAdded(_contentId, _contentUri);
        emit VentureCreated(_ventureId, _manager, _contentId, _minimum);
    }

    function invest(bytes32 _ventureId) external payable {
        address _investor = msg.sender;
        uint _minimum = ventureRegistry[_ventureId].minimum;
        uint _investment = msg.value;
        require(_investment >= _minimum);

        ventureRegistry[_ventureId].totalReceived += _investment;
        ventureRegistry[_ventureId].investors[_investor] = true;
        ventureRegistry[_ventureId].investorCount++;
        
        emit Invested(_ventureId, _investor, _investment);
    }

    function createProposal(bytes32 _ventureId, string calldata _contentUri, uint _value, address _recipient) external {
        address _manager = msg.sender;
        require(_manager == ventureRegistry[_ventureId].ventureManager);
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        bytes32 _proposalId = keccak256(abi.encodePacked(msg.sender, _contentId));

        contentRegistry[_contentId] = _contentUri;

        ventureRegistry[_ventureId].proposals[_proposalId].contentId = _contentId;
        ventureRegistry[_ventureId].proposals[_proposalId].value = _value;
        ventureRegistry[_ventureId].proposals[_proposalId].receivingAddress = _recipient;
        ventureRegistry[_ventureId].proposals[_proposalId].complete = false;
        ventureRegistry[_ventureId].proposals[_proposalId].approvalCount = 0;

        emit ContentAdded(_contentId, _contentUri);
        emit ProposalCreated(_proposalId, _ventureId, _contentId, _recipient, _value);
    }

    function approveProposal(bytes32 _ventureId, bytes32 _proposalId) external {
        address _approver = msg.sender;
    
        bool _isValidApprover = ventureRegistry[_ventureId].investors[_approver];
        require(_isValidApprover == true);
        bool _hasVoted = ventureRegistry[_ventureId].proposals[_proposalId].approvals[_approver];
        require(_hasVoted == false);

        ventureRegistry[_ventureId].proposals[_proposalId].approvals[_approver] = true;
        ventureRegistry[_ventureId].proposals[_proposalId].approvalCount++;

        emit ProposalApproved(_proposalId, _ventureId, _approver);
    }

    function finalizeProposal(bytes32 _ventureId, bytes32 _proposalId) external {
        address _manager = msg.sender;

        require(_manager == ventureRegistry[_ventureId].ventureManager);
        uint _approvers = ventureRegistry[_ventureId].proposals[_proposalId].approvalCount;
        uint _investors = ventureRegistry[_ventureId].investorCount;
        require(_approvers > (_investors / 2));
        bool _isCompleted = ventureRegistry[_ventureId].proposals[_proposalId].complete;
        require(_isCompleted == false);

        address _recipient = ventureRegistry[_ventureId].proposals[_proposalId].receivingAddress;
        uint _value = ventureRegistry[_ventureId].proposals[_proposalId].value;
        payable(_recipient).transfer(_value);
        ventureRegistry[_ventureId].proposals[_proposalId].complete = true;

        emit ProposalFinalized(_proposalId, _ventureId);
    }

    function getContent(bytes32 _contentId) external view returns (string memory) {
        return contentRegistry[_contentId];
    }

    function getVenture(bytes32 _ventureId) external view returns(address, bytes32, uint) {   
        return (
            ventureRegistry[_ventureId].ventureManager,
            ventureRegistry[_ventureId].contentId,
            ventureRegistry[_ventureId].minimum
        );
    }
}
